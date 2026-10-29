import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Conversation Database connected at host ${conn.connection.host}`,
    );
  } catch (error) {
    console.log(`Error while connecting with Conversation database:${error}`);
  }
};

export default connectDB;
