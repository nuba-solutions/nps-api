import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

type TRequestProps = {
    params: {
        user_id: string
    }
}

export async function GET(request: Request, { params : { user_id }}: TRequestProps) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const userId = parseInt(user_id)

        const response = await prisma.user.findUnique({
            where: {
                id: userId
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