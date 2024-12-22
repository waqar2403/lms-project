import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import { catchAsyncError } from "../middleware/AsyncErrors";
import userModel,{ IUser } from "../models/user.models";

import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registerUser = catchAsyncError(async (req: Request,res: Response,next: NextFunction) => {
   try {
    const { name,email,password }: IRegisterUser = req.body;
    const isEmailExist = await userModel.findOne({email});
    if (isEmailExist) {
        return next(new ErrorHandler("Email already exists",400));
    }
    const user:IRegisterUser = {
        name,
        email,
        password,
    };
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationToken;

    const data = {user:{name:user.name},activationCode}

    const html = await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data);
    
    try{
        await sendMail({
            email : user.email,
            subject: "Account Activation",
            template: "activation-mail",
            data,
        });

        res.status(200).json({})
    }
    catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
} catch (error:any) {
    return next(new ErrorHandler(error.message,400));
   }
});

interface IActivationToken {
    token: string;
    activationToken: string;
}
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({user,activationCode},process.env.ACTIVATION_CODE as Secret,{
        expiresIn: "5m"
    });
    return {token,activationToken: activationCode};
}