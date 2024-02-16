import { getServerSession, NextAuthOptions } from "next-auth"
import EmailProvider from 'next-auth/providers/email'
import KeycloakProvider from 'next-auth/providers/keycloak'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../lib/prisma_client"
import { Adapter, AdapterAccount } from "next-auth/adapters"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const prismaAdapter = PrismaAdapter(prisma);

const CustomPrismaAdapter: Adapter = {
  ...prismaAdapter,
  linkAccount: (account: AdapterAccount) => {
    account["not_before_policy"] = account["not-before-policy"];
    delete account["not-before-policy"];
    return prismaAdapter.linkAccount?.(account);
  },
};

export const authOptions: NextAuthOptions = {
    adapter: CustomPrismaAdapter,
	secret: process.env.NEXTAUTH_SECRET || '',
	providers: [
		KeycloakProvider({
			clientId: process.env.KEYCLOAK_CLIENT_ID || '',
			clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
			issuer: process.env.KEYCLOAK_ISSUER,
			authorization: {
				params: {
				grant_type: 'authorization_code',
				scope:
					'openid email profile offline_access',
				response_type: 'code'
				}
			},
			httpOptions: {
				timeout: 30000
			}
		}),
		EmailProvider({
			from: process.env.EMAIL_FROM,
			maxAge: 30 * 60,
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD
				}
			},
		}),
        CredentialsProvider({
			id: 'credentials',
			name: "Credentials",
			credentials: {
				email: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
				client_provider: { label: "Client Provider", type: "number", value: "1" }
			},
			async authorize(credentials, req) {

				if (!credentials?.email || !credentials?.password || !credentials?.client_provider) return null;

				const res = await fetch(`${process.env.BASE_API_URL}/signin`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password,
						client_provider: credentials?.client_provider
					}),
				})

				if (!res || res.status !== 200) return null;
				const user = await res.json();

				if (!user) return null;

				return {
					id: `${user.id}`,
					name: user.name,
					email: user.email,
					stripeId: user.stripeId || null,
					notificationsEnabled: user.notificationsEnabled != null ? user.notificationsEnabled : true,
					theme: user.theme || 'light',
					accessToken: user.accessToken || null,
					client_provider: user.client_provider
				}
			}
        })
	],
	debug: false,
	session: {
		strategy: 'jwt',
		maxAge: 10 * 24 * 60 * 60,
	},
	jwt: {
		maxAge: 10 * 24 * 60 * 60,
	},
	callbacks: {
		async jwt({ token, user, trigger, session, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}

			if (trigger === "update") {
				return { ...token, ...session.user}
			}

			if (user) {
				const chunkedUser = {
					id: `${user.id}`,
					name: user.name,
					email: user.email,
					notificationsEnabled: user.notificationsEnabled != null ? user.notificationsEnabled : true,
					theme: user.theme != null ? user.theme : 'light',
					client_provider: user.client_provider
				}
				return { ...token, ...chunkedUser }
			}

			return token;
		},
		async session({ session, token }) {
			if (token != null) {
				session.user = token as any
			}

			return session
		}
	}
}

export async function auth(req: NextRequest) {
	const accessToken = req.headers.get("Authorization")
 	const session = await getServerSession(authOptions)
    const token = await getToken({req})

	if (!accessToken || !token || !session) return null
	if (token && new Date(token.exp * 1000) <= new Date()) return null
	if (session && new Date(session.user?.exp! * 1000) <= new Date()) return null

	if (token) return token
	else if (session) return session.user
	else return null
}
