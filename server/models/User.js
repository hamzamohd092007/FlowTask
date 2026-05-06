import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    avatar: { type: String, default: "/defaultAvatar.svg" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
}, { timestamps: true });

export default mongoose.model("User", userSchema);