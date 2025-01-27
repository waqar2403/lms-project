import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import  Jwt  from "jsonwebtoken";
require("dotenv").config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseID: string }>;
  comparePassword(password: string): Promise<boolean>;
  'SignAccessToken': ()=> string;
  'SignRefreshToken': ()=> string;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (v: string) {
          return emailRegexPattern.test(v);
        },
        message: `Please enter a valid email`,
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Your password must be at least 6 characters long"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseID: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.SignAccessToken = function (): string {
 return Jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '');
}
userSchema.methods.SignRefreshToken = function (): string {
  return Jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '');
 }
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = model<IUser>("User", userSchema);
export default userModel;
