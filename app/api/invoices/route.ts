import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16'
})

export async function GET(request: NextRequest) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    const stripeId = request.nextUrl.searchParams.get('stId')
    if (!stripeId) return NextResponse.json({ error : "Missing Stripe ID"}, { status: 400 })

	try {
        const queriedInvoices = await stripe.invoices.search({
            query: `customer:\"${stripeId}\"`,
            limit: 100,
        })

        return NextResponse.json(queriedInvoices.data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    const { customerEmail, invoiceItemsData, invoiceDescription, invoiceDueDate } = await request.json()
    if (!customerEmail || !invoiceItemsData || !invoiceDescription || !invoiceDueDate) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: customerEmail
            }
        })

        let userStripeId = user?.stripeId

        const invoice = await stripe.invoices.create({
            customer: userStripeId,
            collection_method: 'send_invoice',
            description: invoiceDescription,
            due_date: invoiceDueDate,
            currency: 'usd',
            payment_settings: {
                payment_method_types: [
                    'card', 'us_bank_account'
                ]
            }
        })

        const createInvoiceLineItem = async (item: Partial<Stripe.InvoiceItem>) => {
            await stripe.invoiceItems.create({
                customer: userStripeId as string,
                amount: item.amount,
                invoice: invoice.id,
                description: item.description as string
            })
        }

        const attachLineItemsToInvoice = async () => {
            return Promise.all(invoiceItemsData.map((item: Partial<Stripe.InvoiceItem>) => createInvoiceLineItem(item)))
        }

        const sendUpdatedInvoice = async () => {
            await stripe.invoices.sendInvoice(invoice.id)
        }

        attachLineItemsToInvoice().then(() => sendUpdatedInvoice())

        return NextResponse.json(invoice)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

