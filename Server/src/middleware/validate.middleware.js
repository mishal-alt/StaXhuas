import { ApiError } from '../utils/apiError.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});
    return next(new ApiError(400, 'Validation Error', 'VALIDATION_ERROR', details));
  }
  next();
};
