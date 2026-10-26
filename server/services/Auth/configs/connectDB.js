import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Auth Database connected at host ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error while connection with Database: ${error}`);
  }
};

export default connectDB;
