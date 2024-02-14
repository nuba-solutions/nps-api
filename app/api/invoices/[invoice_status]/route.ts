import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getToken } from 'next-auth/jwt'

type TRequestStatusProps = {
    params: {
        invoice_status: Stripe.Invoice.Status
    }
}

export async function GET(request: NextRequest, { params : { invoice_status }}: TRequestStatusProps) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    const stripeId = request.nextUrl.searchParams.get('stId')
    if (!stripeId || !invoice_status) return NextResponse.json({ error : "Missing Required Data"}, { status: 400 })

	try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2023-10-16'
        })

        const invoices = await stripe.invoices.search({
            query: `status:\"${invoice_status}\" AND customer:\"${stripeId}\"`,
            limit: 100,
        })

        return NextResponse.json(invoices.data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

