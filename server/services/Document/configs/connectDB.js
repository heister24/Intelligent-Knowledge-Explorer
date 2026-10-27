import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Document Database connected at host ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting with Document Database : ${error}`);
  }
};

export default connectDB;
