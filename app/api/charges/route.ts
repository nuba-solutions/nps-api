import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.charge.findMany({
			include: {
				user: true
			}
		})
		const charges: TCharge[] = response

		return NextResponse.json(charges)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { id }: Partial<TCharge> = await request.json()
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

export async function POST(request: NextRequest) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { title, description, totalAmount, userId }: Partial<TCharge> = await request.json()
	if (!title || !description || !totalAmount || !userId) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const createdCharge: TCharge = await prisma.charge.create({
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

export async function PUT(request: NextRequest) {
	const accessToken = request.headers.get("Authorization")
    const token = await getToken({req: request})
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { id, title, description, totalAmount, userId }: TCharge = await request.json()
	if (!id || !title || !description || !totalAmount || !userId) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const updatedCharge: TCharge = await prisma.charge.update({
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

