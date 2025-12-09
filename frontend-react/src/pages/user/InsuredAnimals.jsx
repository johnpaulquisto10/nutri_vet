import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { ListSkeleton } from '../../components/SkeletonLoader';
import { insuranceService } from '../../services/api';
import toast from 'react-hot-toast';

const InsuredAnimals = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesByStatus, setPagesByStatus] = useState({
        pending: 1,
        approved: 1,
        rejected: 1,
        all: 1
    });
    const itemsPerPage = 10;

    useEffect(() => {
        loadApplications();
    }, []);

    useEffect(() => {
        filterApplicationsList();
    }, [searchTerm, filterStatus, applications]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await insuranceService.getAll();
            const appsData = response.data.data || response.data;
            setApplications(Array.isArray(appsData) ? appsData : []);
        } catch (error) {
            console.error('Failed to load insurance applications:', error);
            toast.error('Failed to load insurance applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(pagesByStatus[status]);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setPagesByStatus(prev => ({
            ...prev,
            [filterStatus]: newPage
        }));
    };

    const filterApplicationsList = () => {
        let filtered = [...applications];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.applicant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.animal_type || app.animalType)?.animal_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.barangay?.barangay_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            const statusName = filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1);
            filtered = filtered.filter(app => app.status?.status_name === statusName);
        }

        setFilteredApplications(filtered);
    };

    // Get counts for each status
    const statusCounts = {
        all: applications.length,
        pending: applications.filter(a => a.status?.status_name === 'Pending').length,
        approved: applications.filter(a => a.status?.status_name === 'Approved').length,
        rejected: applications.filter(a => a.status?.status_name === 'Rejected').length
    };

    // Pagination
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const paginatedApplications = filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (statusName) => {
        switch (statusName) {
            case 'Approved':
                return 'bg-green-100 text-green-700';
            case 'Rejected':
                return 'bg-red-100 text-red-700';
            case 'Pending':
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    const viewDetails = (application) => {
        setSelectedApplication(application);
        setShowDetailsModal(true);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold text-gray-800">
                                My Insured Animals
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage your livestock insurance applications
                            </p>
                        </div>

                        {/* Status Pills and Search */}
                        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <button
                                    onClick={() => handleStatusChange('pending')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${filterStatus === 'pending'
                                            ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <DocumentTextIcon className="w-5 h-5" />
                                    Pending
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${filterStatus === 'pending' ? 'bg-white text-yellow-600' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {statusCounts.pending}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleStatusChange('approved')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${filterStatus === 'approved'
                                            ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    Approved
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${filterStatus === 'approved' ? 'bg-white text-green-600' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {statusCounts.approved} 
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleStatusChange('rejected')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${filterStatus === 'rejected'
                                            ? 'bg-red-500 text-white shadow-lg transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <DocumentTextIcon className="w-5 h-5" />
                                    Rejected
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${filterStatus === 'rejected' ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {statusCounts.rejected}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleStatusChange('all')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${filterStatus === 'all'
                                            ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <DocumentTextIcon className="w-5 h-5" />
                                    All Applications
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${filterStatus === 'all' ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-700'
                                        }`}>
                                        {statusCounts.all}
                                    </span>
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, animal type, breed, or barangay..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Applications List */}
                        {loading ? (
                            <ListSkeleton items={5} />
                        ) : paginatedApplications.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-card p-12 text-center">
                                <ShieldCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Insurance Applications Found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || filterStatus !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Start by submitting an insurance application for your livestock'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Desktop View */}
                                <div className="hidden md:block bg-white rounded-xl shadow-card overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Animal Type</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Breed</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Heads</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Barangay</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedApplications.map((app) => (
                                                    <tr key={app.application_id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-gray-900">{(app.animal_type || app.animalType)?.animal_type_name || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-gray-900">{app.breed || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-gray-900">{app.number_of_heads || 0}</td>
                                                        <td className="px-6 py-4 text-gray-900">{app.barangay?.barangay_name || 'N/A'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status?.status_name)}`}>
                                                                {app.status?.status_name || 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => viewDetails(app)}
                                                                className="text-primary-600 hover:text-primary-700 font-medium"
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-700">
                                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                                                    {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of{' '}
                                                    {filteredApplications.length} results
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </button>
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i + 1}
                                                            onClick={() => handlePageChange(i + 1)}
                                                            className={`px-3 py-1 border rounded-lg ${currentPage === i + 1
                                                                ? 'bg-primary-600 text-white border-primary-600'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden space-y-4">
                                    {paginatedApplications.map((app) => (
                                        <div key={app.application_id} className="bg-white rounded-xl shadow-card p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {(app.animal_type || app.animalType)?.animal_type_name || 'N/A'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {app.breed || 'N/A'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status?.status_name)}`}>
                                                    {app.status?.status_name || 'Pending'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Heads</p>
                                                    <p className="text-sm font-medium text-gray-900">{app.number_of_heads || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Barangay</p>
                                                    <p className="text-sm font-medium text-gray-900">{app.barangay?.barangay_name || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => viewDetails(app)}
                                                className="w-full px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))}

                                    {/* Mobile Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex flex-col items-center gap-3 pt-4">
                                            <p className="text-sm text-gray-700">
                                                Page {currentPage} of {totalPages}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <BottomNav />

            {/* Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex justify-center">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status?.status_name)}`}>
                                    {selectedApplication.status?.status_name || 'Pending'}
                                </span>
                            </div>

                            {/* Farmer Information */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Farmer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="text-gray-900 font-medium">{selectedApplication.applicant?.full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Contact Number</p>
                                        <p className="text-gray-900 font-medium">{selectedApplication.contact_number || selectedApplication.applicant?.phone_number || 'N/A'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="text-gray-900 font-medium">
                                            {selectedApplication.barangay?.barangay_name}, {selectedApplication.barangay?.municipality?.municipality_name}, {selectedApplication.barangay?.municipality?.province?.province_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Animal Information */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Animal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Animal Type</p>
                                        <p className="text-gray-900 font-medium">{(selectedApplication.animal_type || selectedApplication.animalType)?.animal_type_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Purpose</p>
                                        <p className="text-gray-900 font-medium">{selectedApplication.purpose?.purpose_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Number of Heads</p>
                                        <p className="text-gray-900 font-medium">{selectedApplication.number_of_heads || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Date */}
                            <div>
                                <p className="text-sm text-gray-500">Submitted On</p>
                                <p className="text-gray-900 font-medium">
                                    {new Date(selectedApplication.submitted_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuredAnimals;
