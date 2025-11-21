import { GraphQLError, GraphQLFormattedError } from "graphql/error";
import AppError from "./AppError";

const isDev = process.env.NODE_ENV === 'development';

async function formatGraphQLError( formattedError: GraphQLFormattedError,
  error: GraphQLError) {
  const correlationId = error?.extensions?.correlationId;

  // logger.error('GraphQL Error', {
  //   message: error.message,
  //   stack: error.stack,
  //   path: formattedError.path,
  //   correlationId,
  //   extensions: error.extensions
  // });

  // For AppError instances
  if (error.originalError instanceof AppError) {
    const err = error.originalError;


    return {
      message: error.message,
      extensions: {
        code: err.code,
        httpStatus: err.httpStatus,
        details: err.details,
        correlationId,
        timestamp: new Date().toISOString()
      }
    };
  }

  // GraphQL validation errors
  if (formattedError.extensions?.code === 'GRAPHQL_VALIDATION_FAILED') {
    return {
      message: 'Invalid GraphQL query',
      extensions: {
        code: 'BAD_REQUEST',
        httpStatus: 400,
        correlationId,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Parse errors
  if (formattedError.extensions?.code === 'GRAPHQL_PARSE_FAILED') {
    return {
      message: 'Invalid GraphQL syntax',
      extensions: {
        code: 'BAD_REQUEST',
        httpStatus: 400,
        correlationId,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Unknown error (mask)
  return {
    message: isDev ? error.message : 'Internal server error',
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      httpStatus: 500,
      correlationId,
      ...(isDev && { stack: error.stack }),
      timestamp: new Date().toISOString()
    }
  };
}

export default formatGraphQLError;
