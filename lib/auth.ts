import { NextAuthOptions } from "next-auth"
import KeycloakProvider from 'next-auth/providers/keycloak'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../lib/prisma_client"
import { Adapter, AdapterAccount } from "next-auth/adapters"

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

				if (res.status === 401) return null;
				const user = await res.json();

				if (!user) return null;

				delete user.accessToken
				return user;
			}
        })
	],
	debug: true,
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user, trigger, session, account }) {
			delete user.password

			if (trigger === "update") {
				return { ...token, ...session.user}
			}
			else if (user) {
				return { ...token, user }
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
			}

			return session
		}
	}
}