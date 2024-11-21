import mongoose from "mongoose";
require('dotenv').config();

const dbURI: string = process.env.URI || ' ';

const connectDB = async () => {
    try {
        console.log(dbURI);
        await mongoose.connect(dbURI);
        console.log("Successfully connected to MongoDB!");
    } catch (error: any) {
        console.error("Database connection error:", error.message);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;