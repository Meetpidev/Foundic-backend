const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Missing or malformed Authorization header");
    }
    const token = header.split(" ")[1];
    const decoded = verifyAccessToken(token); // { id, role }
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = authMiddleware;