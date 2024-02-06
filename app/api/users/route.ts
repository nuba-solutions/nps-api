import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { encryptPassword } from '@/lib/encryption'
import { verifyJwt } from '@/lib/jwt'
import { createStripeCustomer, updateStripeCustomer } from '@/lib/stripe_helpers'
import { User } from '@prisma/client'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.user.findMany({
            include: {
                charges: true,
            }
        })
        const users: User[] = response.map((user) => {
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

	const { id }: Partial<User> = await request.json()
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

	const { name, email, password, role, theme, notificationsEnabled }: Partial<User> = await request.json()
	if (!name || !email || !password || !theme || notificationsEnabled === null) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	const user = await prisma.user.findFirst({
		where: { email: email }
	})

	if (user) return NextResponse.json({ error: "User email already exists." }, { status: 400 })

	try {
		const stripeCustomer = await createStripeCustomer({
			email,
			name
		})

		let encryptedPass = await encryptPassword(password)
		const createdUser: User = await prisma.user.create({
			data: {
				name: name,
                email: email,
				stripeId: stripeCustomer,
                password: encryptedPass,
				role: role,
				notificationsEnabled: notificationsEnabled,
				theme: theme
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

	const { id, name, email, notificationsEnabled, theme, stripeId }: User = await request.json()
	if (!id || !name || !email || !stripeId || notificationsEnabled === null || !theme) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	const user = await prisma.user.findFirst({
		where: { email: email }
	})

	if (user) return NextResponse.json({ error: "User email already exists." }, { status: 400 })

	try {
		// TODO: Add check for existing emails
		const stripeCustomer = await updateStripeCustomer({
			email,
			name,
			stripeId
		})

		const updatedUser: User = await prisma.user.update({
            where: {
                id: id
            },
			data: {
                id: id,
				name: name,
                email: email,
				stripeId: stripeCustomer,
				notificationsEnabled: notificationsEnabled,
				theme: theme
			}
		})

		return NextResponse.json({ success: 'User updated successfully!', data: {...updatedUser, password: ''}})
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
