import bcrypt from "bcrypt";

export async function encryptPassword(plainPassword: string) {
    return bcrypt.hash(plainPassword, 10).then((hash: string) => {
        return hash
    })
}

export async function comparePassword(plainPassword: string, encryptedPassword: string) {
    return bcrypt.compare(plainPassword, encryptedPassword).then((result: boolean) => {
        return result
    })
}