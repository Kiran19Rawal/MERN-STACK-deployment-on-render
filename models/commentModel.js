import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    useremail: {
      type: String,
    },
    userphone: {
      type: String,
    },
    useraddress: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Comments", commentSchema);
