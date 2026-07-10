const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {

  let error = { ...err };
  error.message = err.message;


  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }


  // Invalid ObjectId
  if (err.name === "CastError") {
    error.statusCode = 400;
    error.message = "Invalid ID";
  }


  // Duplicate key
  if (err.code === 11000) {
    error.statusCode = 409;
    error.message = "Duplicate value already exists";
  }


  // AppError
  if (err instanceof AppError) {
    error.statusCode = err.statusCode;
  }


  res.status(error.statusCode || 500).json({
    status: error.statusCode >= 500 ? "error" : "fail",
    message: error.message || "Internal Server Error",
    data: null
  });
};

module.exports = errorHandler;