class ErrorHandler extends Error {
  code: any;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);    
  }
}
export default ErrorHandler; 