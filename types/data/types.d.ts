type TCharge = {
    id: number
    title: string
    description: string
    totalAmount: number
    createdAt: Date
    updatedAt: Date
    userId: User.id
}

type TUser = {
    id: number
    name: string
    email: string
    password: string
    theme?: string | null
    notificationsEnabled: boolean
    role: UserRole
    createdAt: Date
    charges?: Charge[]
}

type TUserPreferences = {
    id: number
    userId: User.id,
    theme?: string | null
    notificationsEnabled: boolean
}

enum TRole {
    MASTER,
    ADMIN,
    USER
}