
import { Request, Response, NextFunction } from 'express';
async function graphqlHttpStatus() {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      const status =
        body?.errors?.[0]?.extensions?.httpStatus ||
        res.locals.httpStatus ||
        200;

      res.status(status);
      return originalJson(body);
    };

    next();
  };
};


export default graphqlHttpStatus