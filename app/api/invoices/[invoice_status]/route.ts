import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'
import Stripe from 'stripe'

type TRequestProps = {
    params: {
        invoice_status: string
    }
}

export async function GET(request: Request, { params : { invoice_status }}: TRequestProps) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2023-10-16'
        })

        if (!invoice_status) {
            const invoices = await stripe.invoices.list({
                limit: 100
            })
            return NextResponse.json(invoices.data)
        }

        const queriedInvoices = await stripe.invoices.search({
            query: `status:\"${invoice_status}\"`,
            limit: 100,
        })
        return NextResponse.json(queriedInvoices.data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

