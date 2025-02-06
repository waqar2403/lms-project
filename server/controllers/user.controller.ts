import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import { catchAsyncError } from "../middleware/AsyncErrors";
import userModel,{ IUser } from "../models/user.models";
import { sendToken } from "../utils/jwt";

import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

interface IRegisterationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string;
}

export const registrationUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
  try{
    const{name,email,password} = req.body;
    const ifEmailExist = await userModel.findOne({email});
    if(ifEmailExist){
        return new ErrorHandler("Email Already Exists !!!",500)
    };
    const user:IRegisterationBody = {
        name,
        email,
        password,
    }
    const activationToken = createActivationToken(user);
    const ActivationCode = activationToken.activationCode;
    const data = {user:{name:user.name},ActivationCode}
    const html = await ejs.renderFile(path.join(__dirname,"../mail/activation-mail.ejs"),data);

    try{
        await sendMail({
            email: user.email,
            subject:"Account Activation",
            template:"activation-mail.ejs",
            data,
        })
        res.status(200).json({
            success:true,
            message:"Please check your email to activate your account",
            activationToken:activationToken.token,
        })
    }
    catch(error:any){
    return next(new ErrorHandler("Email Could not be sent",500))
    }

  }
  catch (type:any) {
    return next(new ErrorHandler(type.message, 400));
  }
});

interface IActivationToken{
    token:string,
    activationCode:string,
}

export const createActivationToken = (user: any):IActivationToken =>{
  const activationCode  = Math.floor(1000 + Math.random()*9000).toString();
  console.log(activationCode);
  const token = jwt.sign({user,activationCode},process.env.JWTKEY as Secret,{expiresIn:"5m",})
    return {token,activationCode}
}

interface IActivationRequest{
    activation_Code:string;
    activation_Token:string;  
}
export const activateUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
  try{
    const {activation_Code,activation_Token} = req.body as IActivationRequest;
    const newUser:{user:IUser,activationCode:string} = jwt.verify(activation_Token,process.env.JWTKEY as Secret) as {user:IUser,activationCode:string};
    if(activation_Code !== newUser.activationCode){
      return next(new ErrorHandler("Invalid Activation Code",400)) 
    }
    const {name,email,password} = newUser.user;
    const isExists = await userModel.findOne({email});
    if(isExists ) {return next(new ErrorHandler("User Already Exists",400))}
    await userModel.create({name,email,password});
    res.status(200).json({
      success:true,
      message:"Account Activated",
    }) 
  }catch(error:any){
    return next(new ErrorHandler("Error",500))
  }
})

interface ILoginRequest{
    email:string;
    password:string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email and password", 400)
        );
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email and password", 400));
      }
      sendToken(user, 201, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
