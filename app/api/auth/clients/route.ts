import { getClientSecretWithSalt } from "@/lib/auth";
import { encryptPassword } from "@/lib/encryption";
import prisma from "@/lib/prisma_client";
import { randomUUID,  } from "crypto";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'

export const clientCreateSchema = z.object({
	client_provider_id: z.number(),
	user_id: z.string()
})

export type TClientCreateSchema = z.infer<typeof clientCreateSchema>

export async function POST(req: NextRequest) {
	const accessToken = req.headers.get("Authorization")
    const token = await getToken({ req })
	if (!accessToken && !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

    const body: TClientCreateSchema = await req.json()

    const result = clientCreateSchema.safeParse(body)

    let zodErrors = {}
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            zodErrors = { ...zodErrors, [issue.path[0]]: issue.message}
        })

        return NextResponse.json({ success: false, errorsList: zodErrors }, { status: 401 })
    }

    const { client_provider_id: clientProviderId, user_id: userId } = body

    const clientId = randomUUID()
    const clientSecret = await encryptPassword(getClientSecretWithSalt(clientId, userId, clientProviderId))

    const clientCredential = await prisma.clientCredential.create({
        data: {
            clientId,
            clientSecret,
            clientProvider: { connect: { id: clientProviderId }},
            user: { connect: { id: userId.toString() }}
        }
    })

    return NextResponse.json(clientCredential, {status: 200})
}

export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {status: 204})
}