import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma_client'
import { encryptPassword } from '@/lib/encryption'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.user.findMany({
            include: {
                charges: true
            }
        })
        const users: User[] = response

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

	const { name, email, password }: Partial<User> = await request.json()
	if (!name || !email || !password) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	let encryptedPass = await encryptPassword(password)

	try {
		const createdUser: User = await prisma.user.create({
			data: {
				name: name,
                email: email,
                password: encryptedPass
			}
		})

		return NextResponse.json(createdUser)
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
	const accessToken = request.headers.get("Authorization")
	if (!accessToken || !verifyJwt(accessToken)) return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })

	const { id, name, email, password }: Partial<User> = await request.json()
	if (!id || !name || !email || !password) return NextResponse.json({ error : "Missing required data"}, { status: 400 })

	let encryptedPass = await encryptPassword(password)

	try {
		const updatedUser: User = await prisma.user.update({
            where: {
                id: id
            },
			data: {
                id: id,
				name: name,
                email: email,
                password: encryptedPass
			}
		})

		return NextResponse.json({ success: 'User updated successfully!', data: {...updatedUser, password: ''}})
	} catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
