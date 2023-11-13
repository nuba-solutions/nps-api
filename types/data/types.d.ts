type Charge = {
    id: number
    title: string
    description: string
    totalAmount: number
    createdAt: Date
    updatedAt: Date
    userId: User.id
}

type User = {
    id: number
    name: string
    email: string
    password: string
    role: UserRole
    createdAt: Date
    charges?: Charge[]
}

type UserPreferences = {
    id: number
    userId: User.id,
    theme?: string | null
    notificationsEnabled: boolean
}

enum Role {
    MASTER,
    ADMIN,
    USER
}