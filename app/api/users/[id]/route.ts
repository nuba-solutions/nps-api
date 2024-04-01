import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { User } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest, { params : { id }}: RequestProps) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    try {
        const response = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                charges: true,
                notifications: true
            }
        })

        if (!response) return NextResponse.json({ error : 'User not found!' }, { status: 404 })

        const user: User = response

        return NextResponse.json({...user, password: null})
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params : { id }}: RequestProps) {
  console.log("Received notification with", request.body, ' and id:', id);
}