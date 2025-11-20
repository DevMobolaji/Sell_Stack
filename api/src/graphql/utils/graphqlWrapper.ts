import { Request } from "express"
import { Redis } from "ioredis"
import { Session, SessionData } from 'express-session';


export interface Context {
    redis: Redis,
    req: Request
}

export type Resolver = (
    parent: any, args: any, context: Context, info: any
) => any;

export type GraphQLmiddlewareFunc = (
    resolver: Resolver, parent: any, args: any, context: Context, info: any
) => any;

export interface resolverMap {
    [key: string]: {
        [key: string]: Resolver
    }
}