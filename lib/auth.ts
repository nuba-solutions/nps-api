import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
	providers: [
        CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {

				if (!credentials?.email || !credentials?.password) return null;

				const res = await fetch(`${process.env.BASE_API_URL}/signin`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password
					}),
				})

				if (res.status === 401) return null;
				const user = await res.json();

				if (!user) return null;

				return {
					id: `${user.id}`,
					name: user.name,
					email: user.email,
					notificationsEnabled: user.notificationsEnabled,
					theme: user.theme
				}
			}
        })
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === "update") {
				return { ...token, ...session.user}
			}
			return { ...token, ...user}
		},
		async session({ session, token }) {
			session.user = token as any
			return session
		}
	},
	cookies: {
		sessionToken: {
			name: 'next-auth.session-token',
			options: {
				httpOnly: true,
				secure: true
			}
		},
		callbackUrl: {
			name: 'next-auth.callback-url',
			options: {
				httpOnly: true,
				secure: true
			}
		},
		csrfToken: {
			name: 'next-auth.csrf-token',
			options: {
				httpOnly: true,
				secure: true
			}
		},
	}
}