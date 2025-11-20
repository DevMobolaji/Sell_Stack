import { Resolver } from "@/graphql/utils/graphqlWrapper";
import { GraphQLError } from "graphql/error";
import User from "domain/auth/auth.model"
//Need to import User 


//MIDDLEWARE TO CHECK FOR AUTHENTICATION AND ADMIN ACCESS 
export const requiresAuth_adminAcess = async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    const result = await resolver(parent, args, context, info);

    if (!context.session || !context.session.userId) {
        throw new GraphQLError("You must be authenticated to gain Access", {
            extensions: {
                code: "GRAPHQL_VALIDATION_FAILED",
                argument: "AUTH_TYPE"
            }
        })
    }

    const user = await User.findOne({ where: { id: context.session.userId } })
    const usertype = ((user as any).userType)

    if (usertype !== "ADMIN") {
        throw new GraphQLError("Admin authorization required", {
            extensions: {
                code: "GRAPHQL_VALIDATION_FAILED",
                argument: "USERTYPE"
            }
        })
    }
    return User
}

//MIDDLEWARE TO CHECK FOR AUTHENTICATION 
export const requiresAuth = async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    const result = await resolver(parent, args, context, info);

    if (!context.session || !context.session.userId) {
        throw new GraphQLError("You must be authenticated to gain Access", {
            extensions: {
                code: "GRAPHQL_VALIDATION_FAILED",
                argument: "AUTH_TYPE"
            }
        })
    }
    return result
}