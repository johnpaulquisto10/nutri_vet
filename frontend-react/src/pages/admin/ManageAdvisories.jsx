import React, { useState } from 'react';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import toast from 'react-hot-toast';

const ManageAdvisories = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [advisories, setAdvisories] = useState([
        {
            id: 1,
            title: 'Avian Influenza Alert',
            description: 'Critical alert for bird flu in surrounding areas',
            severity: 'high',
            date: '2025-11-10',
        },
        {
            id: 2,
            title: 'Seasonal Vaccination Update',
            description: 'Vaccination season reminder and guidelines',
            severity: 'medium',
            date: '2025-11-08',
        },
        {
            id: 3,
            title: 'Water Quality Standards',
            description: 'New water testing requirements for livestock',
            severity: 'low',
            date: '2025-11-01',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'medium',
    });

    const filteredAdvisories = advisories.filter(
        (advisory) =>
            advisory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            advisory.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (advisory = null) => {
        if (advisory) {
            setEditingId(advisory.id);
            setFormData({
                title: advisory.title,
                description: advisory.description,
                severity: advisory.severity,
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                description: '',
                severity: 'medium',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setAdvisories(
                advisories.map((a) =>
                    a.id === editingId
                        ? { ...a, ...formData, date: a.date }
                        : a
                )
            );
            toast.success('Advisory updated successfully');
        } else {
            setAdvisories([
                ...advisories,
                {
                    ...formData,
                    id: Date.now(),
                    date: new Date().toISOString().split('T')[0],
                },
            ]);
            toast.success('Advisory created successfully');
        }

        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this advisory?')) {
            setAdvisories(advisories.filter((a) => a.id !== id));
            toast.success('Advisory deleted');
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-blue-100 text-blue-700';
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
                                <h1 className="text-3xl font-bold text-secondary-900">Manage Advisories</h1>
                                <p className="text-secondary-600 mt-1">Create and manage farmer advisories</p>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                New Advisory
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                                <input
                                    type="text"
                                    placeholder="Search advisories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Advisories List */}
                        <div className="space-y-4">
                            {filteredAdvisories.map((advisory) => (
                                <div
                                    key={advisory.id}
                                    className="bg-white rounded-lg shadow-card border border-secondary-100 p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-secondary-900">
                                                    {advisory.title}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                                                        advisory.severity
                                                    )}`}
                                                >
                                                    {advisory.severity.charAt(0).toUpperCase() +
                                                        advisory.severity.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-secondary-700">{advisory.description}</p>
                                            <p className="text-sm text-secondary-500 mt-3">
                                                Posted: {new Date(advisory.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleOpenModal(advisory)}
                                                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(advisory.id)}
                                                className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredAdvisories.length === 0 && (
                            <div className="text-center py-8 text-secondary-500">
                                No advisories found
                            </div>
                        )}

                        {/* Modal */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                                <div className="bg-white rounded-2xl shadow-card-lg max-w-2xl w-full p-6 my-8">
                                    <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                                        {editingId ? 'Edit Advisory' : 'Create New Advisory'}
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Advisory title"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, title: e.target.value })
                                                }
                                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Description *
                                            </label>
                                            <textarea
                                                placeholder="Write the advisory details..."
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                rows="6"
                                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Severity Level
                                            </label>
                                            <select
                                                value={formData.severity}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, severity: e.target.value })
                                                }
                                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>

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

export default ManageAdvisories;
