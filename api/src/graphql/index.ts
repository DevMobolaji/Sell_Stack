import { ErrorHandlingPlugin } from "@/core/errors/GraphqlError/errorPlugin";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express5';
import { loadFiles } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Request, Response } from "express";
import path from "path";

import { RedisClientType } from "redis"; // example
//import { getRedisClient } from "../shared/cache/redisClient";
//import { verifyAccessToken } from "../shared/auth/jwt";
// 

const createGraphQLServer = async () => {

  const baseDir = path.join(__dirname);

  // Load ALL typeDefs anywhere under graphql/
  const typeDefs = mergeTypeDefs(
    await loadFiles(path.join(baseDir, './**/*.graphql'), { recursive: true })
  );


  // Load ALL resolvers anywhere under graphql/
  const resolvers = mergeResolvers(
  await loadFiles(
    path.join(baseDir, './**/*.resolver.*')
  )
);

  const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(resolvers),
  resolvers: mergeResolvers(typeDefs),
});
 
  const isProduction = process.env.NODE_ENV === "production";

  const server = new ApolloServer({
    schema,
    plugins: [ErrorHandlingPlugin()],
    introspection: !isProduction,
    // max depth allowed
    formatError: () => {}
  });

  await server.start();

  return expressMiddleware(server, {
    context: async ({ req, res }) => (
        {
        requestId: (req as any).requestId,
        correlationId: req.correlationId,
        // redis,
        }
    )
})
}

export default createGraphQLServer;
