import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true },
    order: { type: Number, default: 0, }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);