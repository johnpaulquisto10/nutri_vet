import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MagnifyingGlassIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { TableSkeleton } from '../../components/SkeletonLoader';
import toast from 'react-hot-toast';
import { insuranceService } from '../../services/api';
import { confirmApprove, confirmReject, successAlert } from '../../utils/sweetAlert';

const InsuranceApplications = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adminNotes, setAdminNotes] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [lastApplicationCount, setLastApplicationCount] = useState(0);
    const [pagesByStatus, setPagesByStatus] = useState({
        pending: 1,
        approved: 1,
        rejected: 1,
        all: 1
    });
    const itemsPerPage = 10;

    useEffect(() => {
        loadApplications();

        // Auto-refresh every 15 seconds to show new applications
        const interval = setInterval(() => {
            loadApplications(true, true); // silent refresh with notification check
        }, 15000);

        return () => clearInterval(interval);
    }, []); // Remove dependency to avoid re-creating interval

    const loadApplications = async (silent = false, checkForNew = false) => {
        try {
            if (!silent) setLoading(true);
            console.log('🔄 Admin: Fetching insurance applications from API...');

            const response = await insuranceService.getAll();
            console.log('📥 Admin: API Response received');
            console.log('🔍 Admin: Full API response:', response.data);

            // Handle paginated response
            const applicationsData = response.data.data || response.data;
            const applicationsList = Array.isArray(applicationsData) ? applicationsData : [];
            const currentCount = applicationsList.length;

            console.log('📊 Admin: Applications count - Old:', lastApplicationCount, 'New:', currentCount);
            if (applicationsList.length > 0) {
                console.log('🔍 Admin: First application sample:', applicationsList[0]);
                console.log('🔍 Admin: AnimalType data:', applicationsList[0]?.animalType);
            }

            // Check for new applications
            if (checkForNew && lastApplicationCount > 0 && currentCount > lastApplicationCount) {
                const newAppsCount = currentCount - lastApplicationCount;
                const latestApp = applicationsList[0]; // Assuming sorted by newest first

                toast.success(
                    `🔔 New insurance application from ${latestApp?.farmer?.full_name || latestApp?.user?.full_name || 'a farmer'}!`,
                    {
                        duration: 6000,
                        icon: '🆕',
                        style: {
                            background: '#3b82f6',
                            color: '#fff',
                            fontWeight: 'bold',
                        }
                    }
                );
                console.log(`✅ Admin: ${newAppsCount} new applications detected!`);
            }

            setLastApplicationCount(currentCount);

            setApplications(applicationsList);

            if (!silent && !checkForNew) {
                toast.success(`Loaded ${newCount} insurance applications`);
            }

            console.log('✅ Admin: Applications loaded successfully');
        } catch (error) {
            console.error('❌ Admin: Error fetching applications:', error);
            console.error('Error details:', error.response?.data);
            if (!silent) {
                toast.error(
                    'Failed to load applications. Please check your connection.',
                    { duration: 4000 }
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleManualRefresh = async () => {
        setRefreshing(true);
        console.log('🔄 Admin: Manual refresh triggered');
        await loadApplications(false, true); // not silent, check for new
        toast.success('✅ Applications refreshed successfully!');
    };

    const handleStatusUpdate = async (id, newStatus) => {
        let result;

        if (newStatus === 'approved') {
            result = await confirmApprove(id);
        } else {
            result = await confirmReject(id);
        }

        if (result.isConfirmed) {
            try {
                const notes = result.value || adminNotes;

                if (newStatus === 'approved') {
                    await insuranceService.approve(id, notes);
                    await successAlert('Approved!', 'Insurance application has been approved. Farmer will be notified.');
                } else {
                    await insuranceService.reject(id, notes);
                    await successAlert('Rejected', 'Insurance application has been rejected. Farmer will be notified.');
                }

                if (showModal) {
                    setShowModal(false);
                    setSelectedApplication(null);
                    setAdminNotes('');
                }
                loadApplications();
            } catch (error) {
                console.error('Error updating application:', error);
                toast.error('Failed to update application');
            }
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    // Handle status change and reset to that status's saved page
    const handleStatusChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(pagesByStatus[status]);
    };

    // Handle page change and save it for current status
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setPagesByStatus(prev => ({
            ...prev,
            [filterStatus]: newPage
        }));
    };

    // Filter and search
    const filteredApplications = applications.filter(app => {
        const farmerName = app.applicant?.full_name || '';
        const barangay = app.barangay?.barangay_name || '';
        // Laravel returns snake_case, not camelCase
        const animalType = (app.animal_type || app.animalType)?.animal_type_name || '';
        const status = (app.status?.status_name || 'pending').toLowerCase();

        const matchesSearch = farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animalType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Get counts for each status
    const statusCounts = {
        all: applications.length,
        pending: applications.filter(a => (a.status?.status_name || 'pending').toLowerCase() === 'pending').length,
        approved: applications.filter(a => (a.status?.status_name || 'pending').toLowerCase() === 'approved').length,
        rejected: applications.filter(a => (a.status?.status_name || 'pending').toLowerCase() === 'rejected').length
    };

    // Pagination
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const paginatedApplications = filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon },
            approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-4 h-4" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col h-screen bg-secondary-50 dark:bg-gray-900">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                                        <h1 className="text-3xl font-bold text-secondary-900">
                                            Insurance Applications
                                        </h1>
                                    </div>
                                    <p className="text-secondary-600 mt-1">
                                        Manage livestock mortality insurance applications • Auto-refreshes every 30s
                                    </p>
                                </div>
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Status Pills */}
                        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <button
                                    onClick={() => handleStatusChange('pending')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${filterStatus === 'pending'
                                        ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <ClockIcon className="w-5 h-5" />
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
                                    <CheckCircleIcon className="w-5 h-5" />
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
                                    <XCircleIcon className="w-5 h-5" />
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
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by farmer name, barangay, or animal type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Applications Table */}
                        <div className="bg-white rounded-xl shadow-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Farmer Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Animal Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No. of Heads
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date Applied
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <TableSkeleton rows={5} columns={6} />
                                        ) : paginatedApplications.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                                    <p className="text-lg font-medium">No applications found</p>
                                                    <p className="text-sm">Applications will appear here when submitted</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedApplications.map((app) => (
                                                <tr key={app.application_id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{app.applicant?.full_name || 'N/A'}</div>
                                                        <div className="text-sm text-gray-500">{app.contact_number || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {app.barangay?.barangay_name || 'N/A'}, {app.barangay?.municipality?.municipality_name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {(app.animal_type || app.animalType)?.animal_type_name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {app.number_of_heads || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(app.submitted_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(app)}
                                                            className="text-primary-600 hover:text-primary-900"
                                                        >
                                                            <EyeIcon className="w-5 h-5 inline" />
                                                        </button>
                                                        {(app.status?.status_name || 'pending').toLowerCase() === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(app.application_id, 'approved')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                    title="Approve"
                                                                >
                                                                    <CheckCircleIcon className="w-5 h-5 inline" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(app.application_id, 'rejected')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Reject"
                                                                >
                                                                    <XCircleIcon className="w-5 h-5 inline" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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
                    </div>
                </main>
            </div>

            {/* Details Modal */}
            {showModal && selectedApplication && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

                        <div className="relative inline-block w-full max-w-3xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
                            <div className="px-6 py-4 bg-primary-600">
                                <h3 className="text-xl font-bold text-white">Application Details</h3>
                            </div>

                            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                                {/* Farmer Information */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Farmer Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.applicant?.full_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Contact Number</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.contact_number || 'N/A'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium text-gray-900">
                                                {selectedApplication.barangay?.barangay_name || 'N/A'}, {selectedApplication.barangay?.municipality?.municipality_name || 'N/A'}, {selectedApplication.barangay?.municipality?.province?.province_name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Animal Information */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Animal Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Type</p>
                                            <p className="font-medium text-gray-900">{(selectedApplication.animal_type || selectedApplication.animalType)?.animal_type_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Purpose</p>
                                            <p className="font-medium text-gray-900 capitalize">{selectedApplication.purpose?.purpose_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Description of Animals</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Number of Heads</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.number_of_heads || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Age</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.age_months || 'N/A'} months</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Breed</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.breed || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Color</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.basic_color || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Male</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.male_count || '0'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Female</p>
                                            <p className="font-medium text-gray-900">{selectedApplication.female_count || '0'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Date */}
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <div className="mt-1">{getStatusBadge((selectedApplication.status?.status_name || 'pending').toLowerCase())}</div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date Submitted</p>
                                            <p className="font-medium text-gray-900">{formatDate(selectedApplication.submitted_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                {(selectedApplication.status?.status_name || 'pending').toLowerCase() === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedApplication.application_id, 'approved')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Approve Application
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedApplication.application_id, 'rejected')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            Reject Application
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedApplication(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuranceApplications;
