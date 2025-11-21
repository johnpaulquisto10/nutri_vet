import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import toast from 'react-hot-toast';
import { advisoryService, referenceService } from '../../services/api';
import { confirmDelete, successAlert } from '../../utils/sweetAlert';

const ManageAdvisories = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [advisories, setAdvisories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdvisories();
        fetchCategories();
        fetchSeverities();
    }, []);

    const fetchAdvisories = async () => {
        try {
            const response = await advisoryService.getAll();
            // Handle paginated response
            const advisoriesData = response.data.data || response.data;
            setAdvisories(Array.isArray(advisoriesData) ? advisoriesData : []);
        } catch (error) {
            console.error('Error fetching advisories:', error);
            toast.error('Failed to load advisories');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await referenceService.getAdvisoryCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSeverities = async () => {
        try {
            const response = await referenceService.getAdvisorySeverities();
            setSeverities(response.data);
        } catch (error) {
            console.error('Error fetching severities:', error);
        }
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        severity_id: '',
        expires_at: '',
    });

    const filteredAdvisories = Array.isArray(advisories) ? advisories.filter(
        (advisory) =>
            advisory.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            advisory.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleOpenModal = (advisory = null) => {
        if (advisory) {
            setEditingId(advisory.advisory_id);
            setFormData({
                title: advisory.title,
                description: advisory.description,
                category_id: advisory.category_id || '',
                severity_id: advisory.severity_id || '',
                expires_at: advisory.expires_at ? advisory.expires_at.split('T')[0] : '',
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                description: '',
                category_id: '',
                severity_id: '',
                expires_at: '',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await advisoryService.update(editingId, formData);
                setShowModal(false);
                await successAlert('Updated!', 'Advisory has been updated successfully.');
            } else {
                await advisoryService.create(formData);
                setShowModal(false);
                await successAlert('Created!', 'New advisory has been created. All users can now see it.');
            }
            fetchAdvisories();
        } catch (error) {
            console.error('Error saving advisory:', error);
            toast.error(error.response?.data?.message || 'Failed to save advisory');
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete('this advisory');
        if (result.isConfirmed) {
            try {
                await advisoryService.delete(id);
                await successAlert('Deleted!', 'Advisory has been deleted.');
                fetchAdvisories();
            } catch (error) {
                console.error('Error deleting advisory:', error);
                toast.error('Failed to delete advisory');
            }
        }
    };

    const getSeverityColor = (severityObj) => {
        const severity = severityObj?.severity_name?.toLowerCase() || 'low';
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
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                                                    {advisory.severity?.severity_name || 'Low'}
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
                                                onClick={() => handleDelete(advisory.advisory_id)}
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
                                                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                                                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Category *
                                            </label>
                                            <select
                                                value={formData.category_id}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, category_id: e.target.value })
                                                }
                                                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.category_id} value={cat.category_id}>
                                                        {cat.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Severity Level *
                                            </label>
                                            <select
                                                value={formData.severity_id}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, severity_id: e.target.value })
                                                }
                                                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            >
                                                <option value="">Select Severity</option>
                                                {severities.map((sev) => (
                                                    <option key={sev.severity_id} value={sev.severity_id}>
                                                        {sev.severity_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Expires At (Optional)
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.expires_at}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, expires_at: e.target.value })
                                                }
                                                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
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
