import * as jwt from 'jsonwebtoken';

export function verifyJWT(token: string) {
    if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
}