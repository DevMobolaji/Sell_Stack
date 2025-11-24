import { AppError } from './AppError';

function mapErrorToPayload(err: unknown) {
  if (err instanceof AppError) {
    return {
      httpStatus: err.statusCode,
      errorCode: err.code,
      message: err.safeMessage,
      details: err.details ?? undefined
    };
  }

  // Unknown / internal error
  return {
    httpStatus: 500,
    errorCode: 'INTERNAL',
    message: 'Internal server error'
  };
}


export default mapErrorToPayload;