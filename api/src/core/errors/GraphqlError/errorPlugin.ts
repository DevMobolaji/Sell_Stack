import { ApolloServerPlugin, GraphQLRequestContext } from '@apollo/server';
// import { logger } from '../../infra/logger';
import formatGraphQLError from './formatError';
import { GraphQLError } from 'graphql/error';
import AppError from './AppError';

type GraphQLCtx = {
  req: Request;
  res: Response;
  correlationId?: string;
  requestId: string;
};

export const ErrorHandlingPlugin = (): ApolloServerPlugin => {
  return {
    async requestDidStart(): Promise<any> {
      return {
        didEncounterErrors(requestContext: GraphQLRequestContext<GraphQLCtx>) {
          const { errors, request } = requestContext;
          const ctx = requestContext.contextValue;
          const requestId = ctx?.requestId;

          // Log each error in structured form (with original stack)
          for (const err of errors ?? []) {
            const original = (err as GraphQLError).originalError;
            logger.error({
              msg: original?.message ?? err.message,
              errorName: original?.constructor?.name ?? err.name,
              requestId,
              path: err.path,
              locations: err.locations,
              stack: original?.stack ?? err.stack,
              code: original instanceof AppError ? (original as AppError).code : err.extensions?.code,
            });
          }
        },

        async willSendResponse(requestContext: GraphQLRequestContext<GraphQLCtx>) {
          const ctx = requestContext.contextValue as any;
          const requestId = ctx?.requestId;
          const env = process.env.NODE_ENV || 'production';


          //ERROR 
          // Format all errors for the client and attach requestId
          if (requestContext.response?.errors?.length) {
            requestContext.response.errors = requestContext.response.errors.map((err: GraphQLError) =>
              formatGraphQLError(err, { requestId, env })
            );
          }

          // Determine the top HTTP status to set on the Express response.
          // Priority: first error's httpStatus if present, else 200.
          const status = (requestContext.response?.errors?.[0]?.extensions?.httpStatus) || 200;

          // If Express res was passed into context, set the status code.
          if (ctx?.res && typeof ctx.res.status === 'function') {
            try {
              ctx.res.status(status);
            } catch (e) {
              logger.warn({ msg: 'Failed to set http status on response', requestId, error: (e as Error).message });
            }
          }

        },
      };
    },
  };
};
