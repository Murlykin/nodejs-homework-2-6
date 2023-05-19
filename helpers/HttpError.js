const HttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
const handleMongooseError = (error, data, next) => {
  error.status = 400;
  next();
};


module.exports = { HttpError, handleMongooseError };
