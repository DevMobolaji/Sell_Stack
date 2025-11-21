import { GraphQLError } from 'graphql/error';

import AppError from './AppError';

const safeMessage = (err: GraphQLError) => {
  if (err.originalError instanceof AppError) return err.originalError.message;
  return 'Internal server error';
};

export function formatGraphQLError(err: GraphQLError, options?: { requestId?: string, env?: string }) {
  const env = options?.env ?? process.env.NODE_ENV;
  const requestId = options?.requestId;

  if (err.originalError instanceof AppError) {
    const appErr = err.originalError as AppError;
    return {
      message: appErr.message,
      extensions: {
        code: appErr.code,
        httpStatus: appErr.httpStatus,
        details: appErr.details ?? null,
        requestId,
      },
    };
  }

  // GraphQL parse/validation / other GraphQLErrors
  const extCode = err.extensions?.code ?? 'INTERNAL_SERVER_ERROR';
  if (extCode === 'GRAPHQL_VALIDATION_FAILED' || extCode === 'GRAPHQL_PARSE_FAILED' || extCode === 'BAD_USER_INPUT') {
    return {
      message: err.message,
      extensions: {
        code: 'BAD_REQUEST',
        httpStatus: 400,
        details: err.extensions ?? null,
        requestId,
      },
    };
  }

  // Unknown/internal errors: mask in prod, include stack in dev (but still log full)
  return {
    message: env === 'development' ? err.message : 'Internal server error',
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      httpStatus: 500,
      requestId,
      ...(env === 'development' ? { stack: (err.extensions?.exception as any)?.stacktrace ?? err.stack } : {}),
    },
  };
}
