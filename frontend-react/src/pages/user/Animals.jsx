import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import toast from 'react-hot-toast';

const Animals = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [animals, setAnimals] = useState([
        {
            id: 1,
            name: 'Bessie',
            type: 'Cattle',
            breed: 'Holstein',
            age: 36,
            weight: 520,
            quantity: 1,
            status: 'healthy',
        },
        {
            id: 2,
            name: 'Daisy',
            type: 'Cattle',
            breed: 'Jersey',
            age: 60,
            weight: 480,
            quantity: 1,
            status: 'healthy',
        },
        {
            id: 3,
            name: 'Spot',
            type: 'Goat',
            breed: 'Saanen',
            age: 24,
            weight: 65,
            quantity: 5,
            status: 'under-observation',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        weight: '',
        quantity: '',
        status: 'healthy',
    });

    const itemsPerPage = 5;

    const filteredAnimals = animals.filter((animal) => {
        const matchesSearch =
            animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animal.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || animal.type === filterType;
        const matchesStatus = filterStatus === 'all' || animal.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAnimals = filteredAnimals.slice(startIndex, endIndex);

    // Reset to page 1 when search term or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, filterStatus]);

    const handleOpenModal = (animal = null) => {
        if (animal) {
            setEditingId(animal.id);
            setFormData(animal);
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                type: '',
                breed: '',
                age: '',
                weight: '',
                quantity: '',
                status: 'healthy',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setAnimals(
                animals.map((a) => (a.id === editingId ? { ...a, ...formData } : a))
            );
            toast.success('Animal updated successfully');
        } else {
            setAnimals([...animals, { ...formData, id: Date.now() }]);
            toast.success('Animal added successfully');
        }

        setShowModal(false);
    };

    const handleDelete = (id) => {
        setAnimals(animals.filter((a) => a.id !== id));
        toast.success('Animal deleted');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-800">Livestock Management</h1>
                                <p className="text-gray-600 mt-1">Manage your farm animals</p>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add Livestock
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="mb-6 space-y-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
                                <input
                                    type="text"
                                    placeholder="Search by owner or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-white text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="Cattle">Cattle</option>
                                    <option value="Goat">Goat</option>
                                    <option value="Pig">Pig</option>
                                    <option value="Chicken">Chicken</option>
                                    <option value="Carabao">Carabao</option>
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-white text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="healthy">Healthy</option>
                                    <option value="under-observation">Under Observation</option>
                                    <option value="sick">Sick</option>
                                </select>

                                {(filterType !== 'all' || filterStatus !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setFilterType('all');
                                            setFilterStatus('all');
                                        }}
                                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors whitespace-nowrap"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Owner</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Type</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Breed</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Age (mos)</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Weight (kg)</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Quantity</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedAnimals.map((animal) => (
                                            <tr
                                                key={animal.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-800">{animal.name}</td>
                                                <td className="px-6 py-4 text-gray-700">{animal.type}</td>
                                                <td className="px-6 py-4 text-gray-700">{animal.breed}</td>
                                                <td className="px-6 py-4 text-gray-700">{animal.age}</td>
                                                <td className="px-6 py-4 text-gray-700">{animal.weight}</td>
                                                <td className="px-6 py-4 text-gray-700">{animal.quantity}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${animal.status === 'healthy'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {animal.status.charAt(0).toUpperCase() + animal.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(animal)}
                                                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(animal.id)}
                                                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredAnimals.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No livestock found
                                </div>
                            )}
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {paginatedAnimals.map((animal) => (
                                <div
                                    key={animal.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">{animal.name}</h3>
                                            <p className="text-sm text-gray-600">{animal.type} • {animal.breed}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${animal.status === 'healthy'
                                                ? 'bg-green-100 text-green-700'
                                                : animal.status === 'sick'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {animal.status.charAt(0).toUpperCase() + animal.status.slice(1).replace('-', ' ')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Age</p>
                                            <p className="text-sm font-medium text-gray-800">{animal.age} months</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Weight</p>
                                            <p className="text-sm font-medium text-gray-800">{animal.weight} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Quantity</p>
                                            <p className="text-sm font-medium text-gray-800">{animal.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleOpenModal(animal)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(animal.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredAnimals.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No livestock found
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {filteredAnimals.length > 0 && totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAnimals.length)} of {filteredAnimals.length}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Modal */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
                                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-md sm:max-w-2xl p-3 sm:p-6 my-2 max-h-[92vh] overflow-y-auto">
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-6">
                                        {editingId ? 'Edit Livestock' : 'Add New Livestock'}
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Owner Name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Type (Cattle, Goat)"
                                            value={formData.type}
                                            onChange={(e) =>
                                                setFormData({ ...formData, type: e.target.value })
                                            }
                                            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Breed"
                                            value={formData.breed}
                                            onChange={(e) =>
                                                setFormData({ ...formData, breed: e.target.value })
                                            }
                                            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                            <input
                                                type="number"
                                                placeholder="Age (months)"
                                                value={formData.age}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, age: e.target.value })
                                                }
                                                className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Weight (kg)"
                                                value={formData.weight}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, weight: e.target.value })
                                                }
                                                className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            value={formData.quantity}
                                            onChange={(e) =>
                                                setFormData({ ...formData, quantity: e.target.value })
                                            }
                                            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black placeholder-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                            min="1"
                                        />
                                        <select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({ ...formData, status: e.target.value })
                                            }
                                            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base bg-white text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="healthy">Healthy</option>
                                            <option value="under-observation">Under Observation</option>
                                            <option value="sick">Sick</option>
                                        </select>

                                        <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                            >
                                                {editingId ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Animals;
