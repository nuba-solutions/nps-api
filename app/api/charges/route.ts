import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: NextRequest) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const chargeId = request.nextUrl.searchParams.get('charge_id')
	const chargeStatus: unknown = request.nextUrl.searchParams.get('charge_status')

	try {
        if (chargeId) {
            const charge = await prisma.charge.findUnique({
                where: {
                    id: parseInt(chargeId)
                },
                include: {
                    user: true,
                    chargeItems: true,
                    clientProvider: true
                }
            })

            if (!charge) return NextResponse.json({ error : "Charge Not Found!"}, { status: 404 })

            return NextResponse.json(charge)
        }

        if (chargeStatus) {
            const charge = await prisma.charge.findMany({
                where: {
                    status: chargeStatus
                },
				orderBy: {
					dueDate: 'asc'
				},
                include: {
                    user: true,
                    chargeItems: true,
                    clientProvider: true
                }
            })

            return NextResponse.json(charge)
        }

        const charges = await prisma.charge.findMany({
			include: {
				user: true,
				chargeItems: true,
				clientProvider: true
			},
			orderBy: {
				dueDate: 'asc'
			}
		})

		return NextResponse.json(charges)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { id }: Partial<TCharge> = await request.json()
	if (!id) return NextResponse.json({ error : "Charge ID is required!"}, { status: 400 })

	try {
		const response = await prisma.charge.delete({
			where: {
				id: id
			}
		}).catch(error => {
			return error.code
		})

		if (response === 'P2025') return NextResponse.json({ error : "Charge not found" }, { status: 404 })

		return NextResponse.json({ success: `Charge ${id} deleted successfully!`}, { status: 201 })

	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { title, description, userId, dueDate, clientProviderId, chargeItems }: Partial<TCharge> = await request.json()
	if (!title || !description || !userId || !dueDate || !clientProviderId || (chargeItems && chargeItems?.length < 1)) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		let totalAmount = 0
		chargeItems?.forEach((item) => {
			totalAmount += item.amount
		})

		const createdCharge: TCharge = await prisma.charge.create({
			data: {
				title: title,
				description: description,
				totalAmount: totalAmount,
				userId: userId,
				dueDate: dueDate,
				clientProviderId: clientProviderId
			}
		})

		const createChargeItem = async (item: TChargeItem) => {
			await prisma.chargeItem.create({
				data: {
					description: item.description as string,
					amount: item.amount as number,
					chargeId: createdCharge.id
				}
			})
		}

		chargeItems?.forEach(async (item: TChargeItem) => {
			await createChargeItem(item)
		})

		return NextResponse.json(createdCharge)
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


