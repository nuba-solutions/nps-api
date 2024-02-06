import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16'
})

export const createStripeCustomer = async ({email, name}: Partial<TUser>) => {
    try {
        const newCustomer = await stripe.customers.create({
            name: name,
            email: email
        })

        return newCustomer.id
    } catch (error) {
        return JSON.stringify({status: 500, error: error})
    }
}

export const updateStripeCustomer = async ({email, name, stripeId}: Partial<TUser>) => {
    try {
        const updatedCustomer = await stripe.customers.update(
            stripeId as string,
            {
                name: name,
                email: email
            }
        )

        return updatedCustomer.id
    } catch (error) {
        return JSON.stringify({status: 500, error: error})
    }
}
