const ApiError = require("../utils/ApiError");

function errorMiddleware(err, req, res, next) {
  if (req.log) req.log.error(err);
  else console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || undefined,
    });
  }

  // Prisma known errors
  if (err.code === "P2002") {
    return res.status(409).json({ success: false, message: "A record with this value already exists" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found" });
  }

  return res.status(500).json({ success: false, message: "Internal server error" });
}

module.exports = errorMiddleware;