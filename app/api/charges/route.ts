import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.charge.findMany({
			include: {
				user: true
			}
		})
		const charges: Charge[] = response

		return NextResponse.json(charges)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { id }: Partial<Charge> = await request.json()
	if (!id) return NextResponse.json({ error : "Charge ID is required!"}, { status: 400 })

	try {
		await prisma.charge.delete({
			where: {
				id: id
			}
		})

		return NextResponse.json({ success: `Charge ${id} deleted successfully!`}, { status: 201 })
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { title, description, totalAmount, userId }: Partial<Charge> = await request.json()
	if (!title || !description || !totalAmount || !userId) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const createdCharge: Charge = await prisma.charge.create({
			data: {
				title: title,
				description: description,
				totalAmount: totalAmount,
				userId: userId
			}
		})

		return NextResponse.json(createdCharge)
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { id, title, description, totalAmount, userId }: Charge = await request.json()
	if (!id || !title || !description || !totalAmount || !userId) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const updatedCharge: Charge = await prisma.charge.update({
			where: {
				id: id
			},
			data: {
				id: id,
				title: title,
				description: description,
				totalAmount: totalAmount,
				userId: userId
			}
		})

		return NextResponse.json(updatedCharge)
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

