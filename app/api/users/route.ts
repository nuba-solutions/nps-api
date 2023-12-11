import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { encryptPassword } from '@/lib/encryption'
import { verifyJwt } from '@/lib/jwt'
import axios from 'axios'
import Stripe from 'stripe'
import { createStripeCustomer } from '@/lib/stripe_helpers'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.user.findMany({
            include: {
                charges: true,
				userPreferences: true
            }
        })
        const users: TUser[] = response.map((user) => {
			return {...user, password: ''}
		})

        return NextResponse.json(users)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { id }: Partial<TUser> = await request.json()
	if (!id) return NextResponse.json({ error: 'User ID is required!' }, { status: 400 })

	try {
		await prisma.user.delete({
			where: {
				id: id
			}
		})

		return NextResponse.json({ success: `User ${id} deleted successfully!`}, { status: 201 })
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { name, email, password, role }: Partial<TUser> = await request.json()
	if (!name || !email || !password) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		// TODO: Add stripe_id as field for each customer || We may use a single customer id as Nuba and handle it ourselves
		const stripeCustomer = await createStripeCustomer(email)

		let encryptedPass = await encryptPassword(password)
		const createdUser: TUser = await prisma.user.create({
			data: {
				name: name,
                email: email,
                password: encryptedPass,
				role: role,
				userPreferences: {}
			}
		})

		return NextResponse.json({...createdUser, password: null})
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { id, name, email, notificationsEnabled, theme }: TUser = await request.json()
	if (!id || !name || !email || !notificationsEnabled || !theme) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const updatedUser: TUser = await prisma.user.update({
            where: {
                id: id
            },
			data: {
                id: id,
				name: name,
                email: email,
				notificationsEnabled: notificationsEnabled,
				theme: theme
			}
		})

		return NextResponse.json({ success: 'User updated successfully!', data: {...updatedUser, password: ''}})
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
