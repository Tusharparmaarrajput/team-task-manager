const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

// Project routes
router.post('/', protect, adminOnly, createProject);
router.get('/', protect, getProjects);
router.post('/:id/members', protect, adminOnly, addMember);

module.exports = router;