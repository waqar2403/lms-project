import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";
import { catchAsyncError } from "../middleware/AsyncErrors";
import userModel,{ IUser } from "../models/user.models";

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
    const activationToken = //createActivationToken(user);
    
   } catch (error:any) {
    return next(new ErrorHandler(error.message,400));
   }
});

interface IActivationToken {
    token: string;
    activationToken: string;
}
