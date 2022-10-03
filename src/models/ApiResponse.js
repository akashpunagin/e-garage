class ApiResponse {
  constructor(isError, errorMessage, data) {
    this.isError = isError;
    this.errorMessage = errorMessage;
    this.data = data;
  }

  static error(errorMessage) {
    return new ApiResponse(true, errorMessage, null);
  }

  static success(data) {
    return new ApiResponse(false, null, data);
  }
}

export default ApiResponse;
