import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import toast from 'react-hot-toast';
import { advisoryService } from '../../services/api';

const Advisories = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [advisories, setAdvisories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdvisories();
    }, []);

    const fetchAdvisories = async () => {
        try {
            console.log('📥 User: Fetching advisories...');
            const response = await advisoryService.getAll();
            // Handle paginated response
            const advisoriesData = response.data.data || response.data;
            console.log('✅ User: Loaded', advisoriesData.length, 'advisories');
            setAdvisories(Array.isArray(advisoriesData) ? advisoriesData : []);
        } catch (error) {
            console.error('❌ User: Error fetching advisories:', error);
            toast.error('Failed to load advisories');
            setAdvisories([]);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severityObj) => {
        const severity = severityObj?.severity_name?.toLowerCase() || 'low';
        switch (severity) {
            case 'high':
                return 'border-red-200 bg-red-50';
            case 'medium':
                return 'border-yellow-200 bg-yellow-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    const getSeverityBadge = (severityObj) => {
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
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold text-gray-800">Advisories & Alerts</h1>
                            <p className="text-gray-600 mt-1">
                                Important updates and recommendations from administrators
                            </p>
                        </div>

                        {/* Advisories */}
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Loading advisories...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {advisories.map((advisory) => (
                                    <div
                                        key={advisory.advisory_id}
                                        className={`bg-white border rounded-lg p-6 transition-all hover:shadow-lg ${getSeverityColor(
                                            advisory.severity
                                        )}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className={`p-2 rounded-lg ${getSeverityBadge(advisory.severity)}`}>
                                                    <ExclamationCircleIcon className="w-6 h-6" />
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {advisory.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {advisory.category?.category_name || 'General'}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getSeverityBadge(
                                                            advisory.severity
                                                        )}`}
                                                    >
                                                        {advisory.severity?.severity_name || 'Low'} Priority
                                                    </span>
                                                </div>

                                                <p className="mt-3 text-gray-700 leading-relaxed">
                                                    {advisory.description}
                                                </p>

                                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        {new Date(advisory.published_at || advisory.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        {new Date(advisory.published_at || advisory.created_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {advisories.length === 0 && (
                            <div className="text-center py-12">
                                <ExclamationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">No advisories at the moment</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Advisories;
