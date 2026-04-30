const Task = require('../models/Task');

// Create a new task (admin only)
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, projectId, assignedTo, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            projectId,
            assignedTo,
            dueDate,
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all tasks for a project
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId })
            .populate('assignedTo', 'name email')
            .populate('projectId', 'name');

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get tasks (admin sees all, member sees assigned)
const getMyTasks = async (req, res) => {
    try {
        let tasks;

        // Admin → get all tasks
        if (req.user.role === 'admin') {
            tasks = await Task.find()
                .populate('assignedTo', 'name email')
                .populate('projectId', 'name');
        }
        // Member → only assigned tasks
        else {
            tasks = await Task.find({ assignedTo: req.user.userId })
                .populate('projectId', 'name');
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ status: 'completed' });
        const inProgress = await Task.countDocuments({ status: 'in-progress' });
        const overdue = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' },
        });

        res.status(200).json({ total, completed, inProgress, overdue });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createTask, getTasksByProject, getMyTasks, updateTaskStatus, getDashboardStats };