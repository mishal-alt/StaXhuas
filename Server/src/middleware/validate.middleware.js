import { ApiError } from '../utils/apiError.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const data = source === 'query' ? req.query : (source === 'params' ? req.params : req.body);
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});
    return next(new ApiError(400, 'Validation Error', 'VALIDATION_ERROR', details));
  }
  
  if (source === 'query') {
    for (const key in req.query) delete req.query[key];
    Object.assign(req.query, value);
  } else if (source === 'params') {
    for (const key in req.params) delete req.params[key];
    Object.assign(req.params, value);
  } else {
    req.body = value;
  }
  
  next();
};
