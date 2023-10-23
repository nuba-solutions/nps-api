import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
    const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

    try {
        const id = request.url.slice(request.url.lastIndexOf("/") + 1)
        const userId = parseInt(id)

        const response = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                charges: true
            }
        })

        if (!response) return NextResponse.json({ error : 'User not found!' }, { status: 404 })

        const user: User = response

        return NextResponse.json(user)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}