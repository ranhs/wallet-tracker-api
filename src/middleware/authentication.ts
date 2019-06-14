import { NestMiddleware, Injectable, MiddlewareFunction, HttpException, HttpStatus } from "@nestjs/common";
import { verify } from 'jsonwebtoken'
import { User } from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

export interface RequestEx extends Request {
    originalUrl: string,
    user: IUser,
    token: string
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    resolve(...args: any[]): MiddlewareFunction {
        return this.use.bind(this)
    }
    async use(req: RequestEx, res: Response, next: Function) {
        let createUser = false
        if ( req.method === 'POST' && req.originalUrl === '/users/login' ) {
            // login request deos not need to be authenticated
            return next()
        }
        if ( req.method === 'POST' && req.originalUrl === "/users" ) {
            // TODO: if there are no users (or no admin users) allow creating an admin user without authentication
            createUser = true
        }
        let token = req.headers['authorization']
        if ( !token ) {
            if ( req.body["admin"]) {
                // requesting to create an admin user without authentication
                const adminUsers: IUser[] = await User.find({admin: true})
                if ( !adminUsers || adminUsers.length === 0 ) {
                    // if there are no admin users, you can create an admin user
                    return next()
                }
            }
            throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED)
        }
        token = token.replace('Bearer ', '')
        const decoded = verify(token, /*process.env.JWT_SECRET*/'asd')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if ( !user ) {
            throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED)
        }
        if ( createUser && !user.admin) {
            throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED)
        }
        req.user = user;
        req.token = token;
        next()
    }
}