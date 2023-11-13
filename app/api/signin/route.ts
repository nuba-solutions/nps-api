import { comparePassword } from '@/lib/encryption'
import { signJwtAccessToken } from '@/lib/jwt'
import prisma from '@/lib/prisma_client'
import { NextRequest, NextResponse } from 'next/server'
import { TSignInSchema, signInSchema } from '@/types/schemas/singIn'

export async function POST(request: NextRequest) {
    const body: TSignInSchema = await request.json()
    const result = signInSchema.safeParse(body)

    let zodErrors = {}
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            zodErrors = { ...zodErrors, [issue.path[0]]: issue.message}
        })

        return NextResponse.json({ success: false, errorsList: zodErrors }, { status: 401 })
    }

    try {
        const { email, password }: TSignInSchema = result.data
        const user = await prisma.user.findFirst({
            where: { email: email },
            include: {
                userPreferences: true
            }
        })

        if (!user || !await comparePassword(password, user.password)) return NextResponse.json({ success: false, statusMessage: 'Unauthorized user' }, { status: 401 })

        const accessToken = signJwtAccessToken(user)

        const signedUser = {
            ...user,
            password: '',
            accessToken
        }

        return NextResponse.json(signedUser)
    } catch (error: any) {
        return NextResponse.json({ success: false, statusMessage: error.message }, { status: 500 })
    }
}