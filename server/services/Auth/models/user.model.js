import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar: String,
  firebaseId: String,
});

const User = mongoose.model("User", userSchema);
export default User;
