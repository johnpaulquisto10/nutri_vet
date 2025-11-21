import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Plus, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import toast from 'react-hot-toast';
import { reportService } from '../../services/api';
import { confirmDelete, confirmResolve, successAlert } from '../../utils/sweetAlert';

const ManageReports = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await reportService.getAll();
            const reportsData = response.data.data || response.data;
            setReports(Array.isArray(reportsData) ? reportsData : []);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load reports');
            setReports([]);
        } finally {
            setLoading(false);
        }
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredReports = reports.filter(
        (report) => {
            const farmerName = report.reporter?.full_name || '';
            const diseaseName = report.disease_name_custom || report.disease?.disease_name || '';
            const statusName = report.status?.status_name?.toLowerCase() || 'pending';

            return (
                (farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    diseaseName.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filterStatus === 'all' || statusName === filterStatus)
            );
        }
    );

    const handleResolve = async (id) => {
        const result = await confirmResolve(id);
        if (result.isConfirmed) {
            try {
                const notes = result.value || 'Report resolved by admin';
                await reportService.resolve(id, notes);
                await successAlert('Resolved!', 'Disease report has been marked as resolved.');
                fetchReports();
            } catch (error) {
                console.error('Error resolving report:', error);
                toast.error('Failed to resolve report');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete('this report');
        if (result.isConfirmed) {
            try {
                await reportService.delete(id);
                await successAlert('Deleted!', 'Disease report has been deleted.');
                fetchReports();
            } catch (error) {
                console.error('Error deleting report:', error);
                toast.error('Failed to delete report');
            }
        }
    };

    const getStatusColor = (statusObj) => {
        const status = statusObj?.status_name?.toLowerCase() || 'pending';
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-700';
            case 'in progress':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
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
                        <div>
                            <h1 className="text-3xl font-bold text-secondary-900">Disease Reports</h1>
                            <p className="text-secondary-600 mt-1">Review and manage disease reports</p>
                        </div>

                        {/* Filters */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by farmer or disease..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="mt-6 bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary-50 border-b border-secondary-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Farmer
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Disease
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Animal
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Image
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.map((report) => (
                                            <tr
                                                key={report.report_id}
                                                className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-secondary-900">
                                                    {report.reporter?.full_name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-secondary-700">
                                                    {report.disease_name_custom || report.disease?.disease_name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-secondary-700">
                                                    {report.animal_name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {report.image_url ? (
                                                        <img
                                                            src={report.image_url}
                                                            alt="Report"
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-secondary-400">No image</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-secondary-600">
                                                    {new Date(report.report_date || report.submitted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                            report.status
                                                        )}`}
                                                    >
                                                        {report.status?.status_name || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {report.status?.status_name !== 'Resolved' && (
                                                            <button
                                                                onClick={() => handleResolve(report.report_id)}
                                                                className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                                                                title="Mark as resolved"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(report.report_id)}
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

                            {filteredReports.length === 0 && (
                                <div className="text-center py-8 text-secondary-500">
                                    No reports found
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageReports;
