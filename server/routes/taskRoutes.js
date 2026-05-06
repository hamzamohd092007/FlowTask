import express from 'express';
import Task from '../models/Task.js';
import auth from '../middlewares/auth.js';

const taskRouter = express.Router();

taskRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const tasks = await Task.find({ userId }).sort({ order: 1 });
        res.status(200).json({ success: true, message: "Tasks fetched successfully", tasks });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

taskRouter.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: "Title cannot be empty" });
        }
        await Task.updateMany({ userId }, { $inc: { order: 1 } });
        const task = await Task.create({ title, userId, order: 0 });
        res.status(201).json({ success: true, message: "Task added successfully", task });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

taskRouter.put("/reorder", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { tasks } = req.body;
        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ success: false, message: "Invalid tasks data" });
        }
        const bulkOps = tasks.map((task, index) => ({
            updateOne: {
                filter: { _id: task._id },
                update: { order: index },
            },
        }));
        await Task.bulkWrite(bulkOps);
        res.status(200).json({ success: true, message: "Order updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal sever error" });
    }
});

taskRouter.put("/complete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        task.completed = !task.completed;
        await task.save();
        res.status(200).json({ success: true, message: "Task toggled successfully", task });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

taskRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        const remainingTasks = await Task.find({ userId }).sort({ order: 1 });
        const bulkOps = remainingTasks.map((task, index) => ({
            updateOne: {
                filter: { _id: task._id, userId },
                update: { order: index },
            },
        }));
        if (bulkOps.length > 0) {
            await Task.bulkWrite(bulkOps);
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

taskRouter.delete("/clear-completed-task", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = await Task.deleteMany({ userId, completed: true });
        if (result.deletedCount === 0) {
            return res.status(200).json({ success: true, message: "No completed tasks to clear", deletedCount: 0 });
        }
        const remainingTasks = await Task.find({ userId }).sort({ order: 1 });
        const bulkOps = remainingTasks.map((task, index) => ({
            updateOne: {
                filter: { _id: task._id, userId },
                update: { order: index },
            },
        }));
        if (bulkOps.length > 0) {
            await Task.bulkWrite(bulkOps);
        }
        res.status(200).json({ success: true, message: "Completed tasks cleared", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default taskRouter