import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request, { params : { id }}: RequestProps) {
    const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

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