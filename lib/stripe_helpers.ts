import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16'
})

export const createStripeCustomer = async (email: string) => {
    try {
        const newCustomer = await stripe.customers.create({
            email: email
        })

        return newCustomer
    } catch (error) {
        return JSON.stringify({status: 500, error: error})
    }
}