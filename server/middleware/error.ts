import { NextFunction,Request,Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
export const ErrorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
     //mongoDB error
    if(err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err}`;
        err = new ErrorHandler(message, 404);
      }
    //duplicate key
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err)} entered`;
        err = new ErrorHandler(message, 400);
    }
    // incorrect JWT tokken
    if(err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid. Try again`;
        err = new ErrorHandler(message, 401);
    }   
    // expired JWT token
    if(err.name === "TokenExpiredError") {
        const message = `JSON Web Token is expired. Try again`;
        err = new ErrorHandler(message, 401);
    }   
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};