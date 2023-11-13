import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.userPreferences.findMany()
        const userPreferences: UserPreferences[] = response

        return NextResponse.json(userPreferences)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { userId, theme, notificationsEnabled }: Partial<UserPreferences> = await request.json()
	if (!userId || !theme || !notificationsEnabled) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const createdUserPreferences: UserPreferences = await prisma.userPreferences.create({
			data: {
				theme: theme,
                notificationsEnabled: notificationsEnabled,
				userId: userId
			}
		})

		return NextResponse.json(createdUserPreferences)
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	const { id, userId, theme, notificationsEnabled }: Partial<UserPreferences> = await request.json()
	if (!id || !userId || !theme || !notificationsEnabled) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	try {
		const updatedPreference: UserPreferences = await prisma.userPreferences.update({
			where: {
				id: id
			},
			data: {
				id: id,
				theme: theme,
                notificationsEnabled: notificationsEnabled,
				userId: userId
			}
		})

		return NextResponse.json(updatedPreference)
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}