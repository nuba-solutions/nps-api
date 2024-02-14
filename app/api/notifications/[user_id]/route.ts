import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { getToken } from 'next-auth/jwt'

type TRequestProps = {
    params: {
        user_id: string
    }
}

export async function GET(request: NextRequest, { params : { user_id }}: TRequestProps) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.user.findUnique({
            where: {
                id: user_id
            },
            include: {
                notifications: true
            }
        })

        if (!response) return NextResponse.json({ error : "Notifications Not Found!"}, { status: 404 })

        const { notifications }: TUser = response

        return NextResponse.json(notifications)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}