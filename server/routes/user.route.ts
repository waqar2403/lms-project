import express from 'express';
import { activateUser, registrationUser, loginUser } from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.post('/registration' , registrationUser);
userRouter.post('/activate-user' , activateUser);
userRouter.post('/user-login',loginUser)
export default userRouter;