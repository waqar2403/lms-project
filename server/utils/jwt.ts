require("dotenv").config();
import {IUser} from "../models/user.models";
import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import ErrorHandler from "./ErrorHandler";
import { redis} from "./redis";

interface ITokenOption{
    expires: Date;
    maxAge: number;
    httpOnly:boolean;
    samSite:'lax'|'strict'|'none' | undefined;
    secure?:boolean;
}

export const sendToken = (user:IUser,statusCode:number,res:Response)=>{
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken(); 
}