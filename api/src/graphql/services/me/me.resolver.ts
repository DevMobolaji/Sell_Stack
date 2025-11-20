import User from "@/domain/auth/auth.model"
import { resolverMap } from "@/graphql/utils/graphqlWrapper"


export const resolvers: resolverMap= {
    Query: {
        user: () => {
            return User
        }
    }
}