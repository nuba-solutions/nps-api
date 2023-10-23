import jwt, { JwtPayload } from 'jsonwebtoken'

interface SignOption {
    expiresIn?: string | number
}

const DEFAULT_SIGN_OPTION: SignOption = {
    expiresIn: '10d'
}

export function signJwtAccessToken(payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) {
    try {
        const secretKey = process.env.NEXTAUTH_SECRET
        const token = jwt.sign(payload, secretKey as string, options)
        return token
    } catch (error) {
        console.error(error)
    }
}

export function verifyJwt(token: string) {
    try {
        const secretKey = process.env.NEXTAUTH_SECRET
        const decoded = jwt.verify(token, secretKey as string)
        return decoded as JwtPayload
    } catch (error) {
        console.error(error)
    }
}