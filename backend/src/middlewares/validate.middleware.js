const ApiError = require("../utils/ApiError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ApiError(422, "Validation failed", result.error.flatten()));
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;