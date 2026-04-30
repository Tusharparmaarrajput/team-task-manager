const Project = require('../models/Project');

// Create a new project (admin only)
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({
            name,
            description,
            createdBy: req.user.userId,
            members: [req.user.userId],
        });

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all projects (admin sees all, member sees their own)
const getProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === 'admin') {
            projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email');
        } else {
            projects = await Project.find({ members: req.user.userId }).populate('createdBy', 'name email').populate('members', 'name email');
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a member to a project (admin only)
const addMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.members.includes(userId)) {
            return res.status(400).json({ message: 'User already a member' });
        }

        project.members.push(userId);
        await project.save();

        res.status(200).json({ message: 'Member added successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createProject, getProjects, addMember };