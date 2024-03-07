import { z } from 'zod'

export const clientFlowSchema = z.object({
	client_id: z.string().uuid(),
	client_secret: z.string(),
    grant_type: z.string().includes("client_credentials")
})

export type TClientFlowSchema = z.infer<typeof clientFlowSchema>
