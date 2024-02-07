type TCharge = {
    id: number
    title: string
    description: string
    totalAmount: number
    status?: ChargeStatus | string
    createdAt: Date
    updatedAt: Date
    dueDate: Date
    user?: TUser
    userId: TUser.id
    chargeItems?: TChargeItem[]
    clientProvider?: TClientProvider
    clientProviderId: TClientProvider.id
}

type TChargeItem = {
    id: number
    description: string
    amount: number
    createdAt: Date
    chargeId: number
}

type TClientProvider = {
    id: number
    name: string
    users: TUser[]
    charge: TCharge[]
}

type TUser = {
    id: number
    name: string
    email: string
    password: string
    theme?: string | null
    notificationsEnabled: boolean
    role?: Role | any
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

type TNotification = {
    id: string | number
    title: string
    description: string
    createdAt: Date
    userId: TUser.id
    createdAt?: Date
}

enum Role {
    MASTER,
    ADMIN,
    USER
}

enum ChargeStatus {
    open,
    paid,
    pending,
    deleted
}