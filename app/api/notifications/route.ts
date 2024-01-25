import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.notification.findMany()

        if (!response) return NextResponse.json({ error : "Notifications Not Found!"}, { status: 404 })

        const notifications: TNotification[] = response

        return NextResponse.json(notifications)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { id }: Partial<TNotification> = await request.json()
	if (!id) return NextResponse.json({ error: 'Notification ID is required!' }, { status: 400 })

	try {
		await prisma.notification.delete({
			where: {
				id: id as number
			}
		})

		return NextResponse.json({ success: `Notification ${id} deleted successfully!`}, { status: 201 })
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { title, description, userId }: Partial<TNotification> = await request.json()
	if (!title || !description || !userId) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const createdNotification: Partial<TNotification> = await prisma.notification.create({
			data: {
				title: title,
				description: description,
				userId: userId
			}
		})

		return NextResponse.json(createdNotification, { status: 200 })
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
