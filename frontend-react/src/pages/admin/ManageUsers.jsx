import React, { useState } from 'react';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Juan Dela Cruz',
            email: 'juan@example.com',
            role: 'farmer',
            animals: 12,
            reports: 5,
            joinDate: '2025-08-15',
        },
        {
            id: 2,
            name: 'Maria Santos',
            email: 'maria@example.com',
            role: 'farmer',
            animals: 8,
            reports: 3,
            joinDate: '2025-09-20',
        },
        {
            id: 3,
            name: 'Pedro Lopez',
            email: 'pedro@example.com',
            role: 'farmer',
            animals: 15,
            reports: 7,
            joinDate: '2025-07-10',
        },
        {
            id: 4,
            name: 'Ana Garcia',
            email: 'ana@example.com',
            role: 'farmer',
            animals: 6,
            reports: 2,
            joinDate: '2025-10-05',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'farmer',
    });

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingId(user.id);
            setFormData({ name: user.name, email: user.email, role: user.role });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', role: 'farmer' });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setUsers(
                users.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
            );
            toast.success('User updated successfully');
        } else {
            setUsers([
                ...users,
                {
                    ...formData,
                    id: Date.now(),
                    animals: 0,
                    reports: 0,
                    joinDate: new Date().toISOString().split('T')[0],
                },
            ]);
            toast.success('User created successfully');
        }

        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter((u) => u.id !== id));
            toast.success('User deleted');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-secondary-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-secondary-900">User Management</h1>
                                <p className="text-secondary-600 mt-1">Manage farmers and system users</p>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add User
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary-50 border-b border-secondary-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Livestock
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Reports
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Joined
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-secondary-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-secondary-700">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-secondary-700">{user.animals}</td>
                                                <td className="px-6 py-4 text-secondary-700">{user.reports}</td>
                                                <td className="px-6 py-4 text-secondary-600">
                                                    {new Date(user.joinDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(user)}
                                                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8 text-secondary-500">
                                    No users found
                                </div>
                            )}
                        </div>

                        {/* Modal */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-card-lg max-w-md w-full p-6">
                                    <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                                        {editingId ? 'Edit User' : 'Add New User'}
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                        <select
                                            value={formData.role}
                                            onChange={(e) =>
                                                setFormData({ ...formData, role: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="farmer">Farmer</option>
                                            <option value="admin">Admin</option>
                                        </select>

                                        <div className="flex gap-2 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 px-4 py-2 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                                {editingId ? 'Update' : 'Create'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageUsers;
