import { GraphQLmiddlewareFunc, Resolver } from "@/graphql/utils/graphqlWrapper"

export const createMiddleware = (middlewareFunc: GraphQLmiddlewareFunc, resolverFunc: Resolver) => (
    parent: any, args: any, context: any, info: any) => (middlewareFunc(resolverFunc, parent, args, context, info))