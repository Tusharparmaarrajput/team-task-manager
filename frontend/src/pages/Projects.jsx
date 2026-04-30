import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Projects = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await API.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to fetch projects', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/projects', formData);
            setFormData({ name: '', description: '' });
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">T</span>
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Team Task Manager</h1>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/tasks')}
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
                    >
                        Tasks
                    </button>
                    <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {user?.role}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-8 py-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
                    <p className="text-gray-500 mt-1">Manage your team projects.</p>
                </div>

                {/* Create project form - admin only */}
                {user?.role === 'admin' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-5">Create New Project</h3>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter project name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    {loading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Projects list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-lg font-bold">
                                        {project.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Created by: {project.createdBy?.name || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-10 text-center">
                            <p className="text-gray-400 text-sm">No projects found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Projects;