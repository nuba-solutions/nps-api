import { NextResponse } from 'next/server';

const allowedOrigins = ['https://localhost:3000', 'http://localhost:3000', 'https://nvoicex-client-portal.vercel.app']

export async function middleware(request: Request) {
	const origin = request.headers.get('origin')
	const response = NextResponse.next()

	if (origin && allowedOrigins.includes(origin as string)) {
		response.headers.append('Access-Control-Allow-Origin', origin);
		response.headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		response.headers.append('Access-Control-Allow-Credentials', "true")
		response.headers.append(
			'Access-Control-Allow-Headers',
			'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Authorization, Content-MD5, Content-Type, Date, X-Api-Version'
		)
	}

	return response
 }

 export const config = {
    matcher: ['/api/users/:path*', '/api/notifications/:path*', '/api/tenants/:path*'],
 }
