import React, { useState, useEffect } from 'react';
import { BoltIcon, DocumentTextIcon, ExclamationCircleIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
import { CardSkeleton, ListSkeleton } from '../../components/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalAnimals: 0,
        activeReports: 0,
        resolvedReports: 0,
        advisories: 0,
    });
    const [recentReports, setRecentReports] = useState([]);
    const [advisories, setAdvisories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getFarmerDashboard();
            const data = response.data;
            const stats = data.statistics || data;

            setStats({
                totalAnimals: stats.approved_applications || 0,
                activeReports: stats.active_reports || 0,
                resolvedReports: (stats.total_reports || 0) - (stats.active_reports || 0),
                advisories: stats.unread_advisories || 0,
            });

            setRecentReports(data.recent_reports || []);
            setAdvisories(data.recent_advisories || []);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
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
                            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                                Welcome, {user?.full_name || user?.name || 'User'}! 👋
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Here's an overview of your livestock and recent reports
                            </p>
                        </div>

                        {/* Stats Cards */}
                        {loading ? (
                            <CardSkeleton cards={4} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <DashboardCard
                                    icon={BoltIcon}
                                    label="Insured Animals"
                                    value={stats.totalAnimals}
                                    trend="Approved applications"
                                    trendUp={true}
                                />
                                <DashboardCard
                                    icon={DocumentTextIcon}
                                    label="Active Reports"
                                    value={stats.activeReports}
                                    trend="3 pending"
                                    trendUp={false}
                                />
                                <DashboardCard
                                    icon={ExclamationCircleIcon}
                                    label="Resolved Reports"
                                    value={stats.resolvedReports}
                                    trend="100% recovery"
                                    trendUp={true}
                                />
                                <DashboardCard
                                    icon={ArrowTrendingUpIcon}
                                    label="New Advisories"
                                    value={stats.advisories}
                                    trend="Latest updates"
                                    trendUp={true}
                                />
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Reports */}
                            <div className="lg:col-span-2">
                                <ChartCard title="Recent Disease Reports">
                                    {loading ? (
                                        <ListSkeleton items={3} />
                                    ) : (
                                        <div className="space-y-3">
                                            {recentReports.map((report) => (
                                                <div
                                                    key={report.report_id || report.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-600 dark:hover:border-red-500 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 dark:text-gray-100">
                                                            {report.disease_name_custom || report.disease?.disease_name || report.disease || 'Unknown Disease'}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(report.submitted_at || report.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${(report.status?.status_name || report.status || '').toLowerCase() === 'resolved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {(() => {
                                                            const statusText = report.status?.status_name || report.status || 'pending';
                                                            return statusText.charAt(0).toUpperCase() + statusText.slice(1);
                                                        })()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ChartCard>
                            </div>

                            {/* Latest Advisories */}
                            <div>
                                <ChartCard title="Latest Advisories">
                                    <div className="space-y-3">
                                        {advisories.length === 0 ? (
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                                No new advisories
                                            </p>
                                        ) : (
                                            advisories.map((advisory) => (
                                                <div
                                                    key={advisory.advisory_id}
                                                    className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700 cursor-pointer hover:border-red-600 dark:hover:border-red-500 transition-colors"
                                                >
                                                    <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                                                        {advisory.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {new Date(advisory.published_at || advisory.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ChartCard>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <a
                                    href="/user/animals"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500 hover:shadow-lg transition-all text-center"
                                >
                                    <BoltIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Manage Livestock</p>
                                </a>
                                <a
                                    href="/user/reports"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500 hover:shadow-lg transition-all text-center"
                                >
                                    <DocumentTextIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Submit Report</p>
                                </a>
                                <a
                                    href="/user/advisories"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500 hover:shadow-lg transition-all text-center"
                                >
                                    <ExclamationCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-gray-700 dark:text-gray-300">View Advisories</p>
                                </a>
                                <a
                                    href="/user/animals"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500 hover:shadow-lg transition-all text-center"
                                >
                                    <ArrowTrendingUpIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Health Stats</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default UserDashboard;
