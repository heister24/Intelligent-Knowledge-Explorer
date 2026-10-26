import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Auth Database connected at host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to Database: ${error.message}`);
  }
};

export default connectDB;
