const { v4: uuid } = require('uuid');

module.exports = function correlationIdMiddleware(req, res, next) {
  const id = req.headers['x-correlation-id'] || uuid();

  req.correlationId = id;

  // Attach to response for clients to see
  res.setHeader('x-correlation-id', id);

  next();
};