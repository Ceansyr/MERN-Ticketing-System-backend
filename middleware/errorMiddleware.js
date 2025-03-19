const errorHandler = (err, res) => {
  console.error(err.stack); // Log errors for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack in production
  });
};

export default errorHandler;
