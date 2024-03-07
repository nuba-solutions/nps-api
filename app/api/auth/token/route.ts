import { comparePassword } from '@/lib/encryption'
import prisma from '@/lib/prisma_client'
import { NextRequest, NextResponse } from 'next/server'
import { clientFlowSchema, TClientFlowSchema } from "@/types/schemas/clientFlow"
import { authOptions, getClientSecretWithSalt } from '@/lib/auth'
import { encode } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
    const body: TClientFlowSchema = await req.json()
    const result = clientFlowSchema.safeParse(body)

    let zodErrors = {}
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            zodErrors = { ...zodErrors, [issue.path[0]]: issue.message}
        })

        return NextResponse.json({ success: false, errorsList: zodErrors }, { status: 401 })
    }

    const { client_id, client_secret }: TClientFlowSchema = result.data

    try {
        const user = await prisma.user.findFirst({
            where: { clientCredentials: { some: { clientId: client_id } } },
            include: {
                clientProviders: true,
                clientCredentials: true
            }
        })

        const clientCredential = user?.clientCredentials.find(cc => cc.clientId === client_id)

        if (!user || !clientCredential || !await comparePassword(getClientSecretWithSalt(clientCredential.clientId, clientCredential.userId, clientCredential.clientProviderId), client_secret)) {
            return NextResponse.json({ success: false, statusMessage: 'Unauthorized user' }, { status: 401 })
        }

        const accessToken = await encode({
            secret: process.env.NEXTAUTH_SECRET as string,
            maxAge: authOptions.jwt?.maxAge!,
            token: {
                ...user,
                sub: user.id,
            } as any})

        return NextResponse.json({
            access_token: accessToken,
            expires_in: 0,
            token_type: "client_credentials"
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, statusMessage: error.message }, { status: 500 })
    }
}