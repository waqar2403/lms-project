require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use(cors({
origin: process.env.ORIGIN
}));

//routes
app.use("/api/v1",userRouter);

app.get("/test", (req:Request, res:Response , next:NextFunction) => {
    res.status(200).json({
        success:true,
        message:"API is working",

    });
})

//unkown route
app.all("*", (req:Request, res:Response, next:NextFunction) => {
    res.status(404).json({
        success:false,
        message:"Route not found"
    });
});
app.use(ErrorMiddleware);
export {app};