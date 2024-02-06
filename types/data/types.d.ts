type TCharge = {
    id: number
    title: string
    description: string
    totalAmount: number
    createdAt: Date
    updatedAt: Date
    userId: TUser.id
}

type TUser = {
    id: number
    name: string
    email: string
    password: string
    theme?: string | null
    notificationsEnabled: boolean
    role: Role
    createdAt: Date
    charges?: TCharge[]
    notifications?: TNotification[]
    stripeId: string
}

type TUserPreferences = {
    id: number
    userId: TUser.id,
    theme?: string | null
    notificationsEnabled: boolean
}

enum TRole {
    MASTER,
    ADMIN,
    USER
}

type TNotification = {
    id: string | number
    title: string
    description: string
    createdAt: Date
    userId: TUser.id
    createdAt?: Date
}