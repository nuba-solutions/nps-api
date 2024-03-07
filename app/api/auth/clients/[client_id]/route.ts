import prisma from "@/lib/prisma_client"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

type TRequestProps = { params: { client_id: string }}

export async function GET(req: NextRequest, { params: { client_id }}: TRequestProps) {
	const accessToken = req.headers.get("Authorization")
    const token = await getToken({ req })
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.clientCredential.findUnique({
            where: {
                clientId: client_id
            }
        })

        if (!response) return NextResponse.json({ error : "Client Credentials Not Found!"}, { status: 404 })

        return NextResponse.json(response)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params: { client_id }}: TRequestProps) {
	const accessToken = req.headers.get("Authorization")
    const token = await getToken({ req })
	if (!accessToken || !token) return NextResponse.json({ error : "Unauthorized request"}, { status: 401 })

	try {
        const response = await prisma.clientCredential.delete({
            where: {
                clientId: client_id
            }
        })

        if (!response) return NextResponse.json({ error : "Client Credentials Not Found!"}, { status: 404 })

        return NextResponse.json(response, { status: 204 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
