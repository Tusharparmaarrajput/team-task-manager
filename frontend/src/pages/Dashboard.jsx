import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/tasks/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
            }
        };
        fetchStats();
    }, []);

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
                        onClick={() => navigate('/projects')}
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
                    >
                        Projects
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

            {/* Content */}
            <div className="max-w-6xl mx-auto px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name}
                    </h2>
                    <p className="text-gray-500 mt-1">Here is what is happening with your projects today.</p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 text-base">📋</span>
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-xs text-gray-400 mt-1">All tasks across projects</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">Completed</p>
                            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-base">✓</span>
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-xs text-gray-400 mt-1">Successfully finished</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">In Progress</p>
                            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-base">→</span>
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
                        <p className="text-xs text-gray-400 mt-1">Currently being worked on</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">Overdue</p>
                            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 text-base">!</span>
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-red-600">{stats.overdue}</p>
                        <p className="text-xs text-gray-400 mt-1">Past their due date</p>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/projects')}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                            View Projects
                        </button>
                        <button
                            onClick={() => navigate('/tasks')}
                            className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                            View Tasks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;