class ApiError extends Error {
  constructor(message, _statusCode) {
    super(message);
    this.statusCode = _statusCode || 500;
  }
}
module.exports = ApiError;
