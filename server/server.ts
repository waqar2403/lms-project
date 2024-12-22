import {app} from "./app";
import connectDB from "./utils/db";
require("dotenv").config();
connectDB();
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
})