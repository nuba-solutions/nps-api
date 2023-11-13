import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'
import Stripe from 'stripe'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2023-10-16'
        })

        const invoices = await stripe.invoices.list({
            limit: 100,
        });

        return NextResponse.json(invoices.data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

