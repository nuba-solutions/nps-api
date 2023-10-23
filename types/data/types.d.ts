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
    createdAt: Date
    charges?: Charge[]
}