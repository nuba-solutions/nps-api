import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest, { params : { id }}: RequestProps) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    try {
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

        const charge: TCharge = response

        return NextResponse.json(charge)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}