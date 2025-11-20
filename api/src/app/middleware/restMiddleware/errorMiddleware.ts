import logger from '@/core/logging/logger';
import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';

async function errorMiddleware(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): Promise<Response<any, Record<string, any>> | void> {

    let customError = {
        statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong',

        success: false
    };


    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors).map((item: any) => item.message).join(', ');
        customError.statusCode = 400
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field choose another value`;
        customError.statusCode = 400
    }
    if (err.name === 'castError') {
        customError.message = `No item found with id : ${err.value}`
        customError.statusCode = 404
    }

     logger.error(err);
     return res.status(customError.statusCode).json({
        message: customError.message
    })

}

export default errorMiddleware;