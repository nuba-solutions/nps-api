import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
	try {
        const tenantProviders = await prisma.clientProvider.findMany({
            include: {
                users: false,
                Charge: false
            }
        })

        if (!tenantProviders) return NextResponse.json({ error : "Tenant Providers Not Found!"}, { status: 404 })

        return NextResponse.json(tenantProviders)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}