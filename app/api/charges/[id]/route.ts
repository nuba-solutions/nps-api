import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
    const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    try {
        const id = request.url.slice(request.url.lastIndexOf("/") + 1)
        const chargeId = parseInt(id)

        const response = await prisma.charge.findUnique({
            where: {
                id: chargeId
            },
            include: {
                user: true
            }
        })

        if (!response) return NextResponse.json({ error : "Charge Not Found!"}, { status: 404 })

        const charge: Charge = response

        return NextResponse.json(charge)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}