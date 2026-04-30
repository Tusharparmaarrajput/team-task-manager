const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasksByProject,
    getMyTasks,
    updateTaskStatus,
    getDashboardStats,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

// Task routes
router.post('/', protect, adminOnly, createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.get('/my-tasks', protect, getMyTasks);
router.patch('/:id/status', protect, updateTaskStatus);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;