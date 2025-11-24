import { ApolloServerPlugin, GraphQLRequestListener  } from '@apollo/server';
import { GraphQLCtx } from './utils/context';
import { LogEvent } from '@/core/logging/types';

import mapErrorToPayload from '@/core/errors/ErrorMapper';
import { createRequestId, createTraceId } from '@/core/logging/requestId';

export const StatusAndCorrelationPlugin = (): ApolloServerPlugin<GraphQLCtx> => {
  return {
    async requestDidStart(requestContext): Promise<GraphQLRequestListener<GraphQLCtx>> {
      const start = Date.now();

      const { contextValue } = requestContext

      const requestId = contextValue.requestId || createRequestId();
      const traceId = contextValue.traceId || createTraceId();
      
  if (!contextValue) return {};
      return {
        async willSendResponse({ response, errors, contextValue }) {
          const duration = Date.now() - start;
          const log: LogEvent = {
            actor: contextValue.user?.id || null,
            action: "GRAPHQL_REQUEST",
            duration,
            ip: contextValue.ip,
            userAgent: contextValue.userAgent,
            traceId,
            requestId,
            url: ''
          };
          // If there are errors, extract highest-priority http status (AppError wins)
          if (errors && errors.length && response?.http) {
            let status = 200;
            for (const err of errors) {
              const payload = mapErrorToPayload(err);
              if (payload.httpStatus && payload.httpStatus > status) status = payload.httpStatus;
              // attach safe extensions to GraphQL error
              // ensure we don't add stack traces
              if (!err.extensions) err.extensions = {};
              err.extensions['requestId'] = contextValue?.requestId;
              err.extensions['code'] = payload.errorCode;
            }
            response.http.status = status;
          } else if (response?.http && contextValue?.requestId) {
            // GraphQL success responses still carry request id header
            response.http.headers.set('x-correlation-id', contextValue.requestId);
          }
        }
      };
    }
  };
};


