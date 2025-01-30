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
    sameSite:'lax'|'strict'|'none' | undefined;
    secure?:boolean;
}
const AccessTokenExpires = parseInt(
    process.env.ACCESS_TOKEN_EXP || "900",10
)
const RefreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXP || "604800",10
)
export const accessTokenOptions: ITokenOption = {
    expires : new Date(Date.now()+ AccessTokenExpires*1000),
    maxAge: AccessTokenExpires*1000,
    httpOnly:true,
    sameSite:"lax",
}
export const refreshTokenOptions:ITokenOption = {
    expires: new Date(Date.now() + RefreshTokenExpire*1000),
    maxAge: RefreshTokenExpire*1000,
    httpOnly: true,
    sameSite:"lax",
}
export const sendToken = (user:IUser,statusCode:number,res:Response)=>{
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken(); 
    redis.set(user._id as any, JSON.stringify(user) as any);

    if(process.env.NODE_ENV === "production"){
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken,accessTokenOptions);
    res.cookie("refresh_token",refreshToken,refreshTokenOptions);

    res.status(statusCode).json({success:true,user,accessToken})
}