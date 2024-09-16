import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {});
        isConnected = db.connection.readyState;

        console.log("DB Connected successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log("DB Connection failed");
        process.exit(1);
    }
};

export default connectDB;