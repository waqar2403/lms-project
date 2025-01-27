require("dotenv").config();
import {IUser} from "../models/user.models";
import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import ErrorHandler from "./ErrorHandler";
import { redis} from "./redis";