import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Tasks = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        projectId: '',
        assignedTo: '',
        dueDate: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchProjects();
        if (user?.role === 'admin') fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await API.get('/tasks/my-tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await API.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to fetch projects', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await API.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
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
            await API.post('/tasks', formData);
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                projectId: '',
                assignedTo: '',
                dueDate: '',
            });
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, status) => {
        try {
            await API.patch(`/tasks/${taskId}/status`, { status });
            fetchTasks();
        } catch (err) {
            console.error('Failed to update task status', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        if (status === 'completed') return 'bg-green-100 text-green-700';
        if (status === 'in-progress') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    const getPriorityBadge = (priority) => {
        if (priority === 'high') return 'bg-red-100 text-red-700';
        if (priority === 'medium') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
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
                        onClick={() => navigate('/projects')}
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
                    >
                        Projects
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
                    <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
                    <p className="text-gray-500 mt-1">Manage and track all your tasks.</p>
                </div>

                {/* Create task form - admin only */}
                {user?.role === 'admin' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-5">Create New Task</h3>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter task title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="sm:col-span-2">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                <select
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select project</option>
                                    {projects.map((p) => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                                <select
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select user</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
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
                                    {loading ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tasks list */}
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityBadge(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    {task.description && (
                                        <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                                    )}
                                    <div className="flex items-center gap-4">
                                        {task.projectId?.name && (
                                            <span className="text-xs text-gray-400">
                                                Project: {task.projectId.name}
                                            </span>
                                        )}
                                        {task.dueDate && (
                                            <span className="text-xs text-gray-400">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                            <p className="text-gray-400 text-sm">No tasks found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;