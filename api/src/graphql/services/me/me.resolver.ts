import User from "@/domain/auth/auth.model"
import { Resolver } from "@/graphql/utils/graphqlWrapper"


export const resolvers: Resolver = {
    Query: {
        user: () => {
            return User
    }
  }
}