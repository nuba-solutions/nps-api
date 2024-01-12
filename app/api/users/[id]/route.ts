import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request, { params : { id }}: RequestProps) {
    const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

    try {
        const userId = parseInt(id)

        const response = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                charges: true,
                notifications: true
            }
        })

        if (!response) return NextResponse.json({ error : 'User not found!' }, { status: 404 })

        const user: TUser = response

        return NextResponse.json({...user, password: null})
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}