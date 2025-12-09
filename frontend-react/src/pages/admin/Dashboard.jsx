import React, { useState, useEffect } from 'react';
import {
    Users,
    Zap,
    FileText,
    AlertCircle,
    TrendingUp,
    Activity,
    ShieldCheck,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
import { CardSkeleton, ChartSkeleton } from '../../components/SkeletonLoader';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import toast from 'react-hot-toast';
import { dashboardService } from '../../services/api';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        total_farmers: 0,
        total_applications: 0,
        approved_applications: 0,
        rejected_applications: 0,
        total_reports: 0,
        submitted_reports: 0,
        investigating_reports: 0,
        resolved_reports: 0,
        active_advisories: 0,
    });
    const [loading, setLoading] = useState(true);
    const [lastReportCount, setLastReportCount] = useState(0);
    const [lastApplicationCount, setLastApplicationCount] = useState(0);
    const [timeRange, setTimeRange] = useState('weekly'); // daily, weekly, monthly

    useEffect(() => {
        fetchDashboardData();

        // Poll for new reports and applications every 15 seconds
        const interval = setInterval(() => {
            fetchDashboardData(true);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const [chartData, setChartData] = useState([]);
    const [animalData, setAnimalData] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);
    const [recentReports, setRecentReports] = useState([]);

    // Color palettes for charts
    const animalColors = [
        '#ef4444', // red
        '#f59e0b', // amber
        '#10b981', // emerald
        '#3b82f6', // blue
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#14b8a6', // teal
        '#f97316', // orange
    ];

    const diseaseColors = [
        '#dc2626', // red-600
        '#ea580c', // orange-600
        '#ca8a04', // yellow-600
        '#16a34a', // green-600
        '#0891b2', // cyan-600
        '#2563eb', // blue-600
        '#7c3aed', // violet-600
        '#c026d3', // fuchsia-600
    ];

    const fetchDashboardData = async (checkForNew = false) => {
        try {
            console.log('📥 Admin: Fetching dashboard data...');
            const response = await dashboardService.getAdminDashboard();
            const data = response.data;

            console.log('✅ Admin Dashboard Data:', data);

            const newStats = data.statistics || {};

            // Check for new reports and applications
            if (checkForNew && lastReportCount > 0) {
                const currentReports = newStats.total_reports || 0;
                const currentApplications = newStats.total_applications || 0;

                if (currentReports > lastReportCount) {
                    const newReportsCount = currentReports - lastReportCount;
                    toast.success(
                        `🔔 ${newReportsCount} new disease report${newReportsCount > 1 ? 's' : ''} received!`,
                        {
                            duration: 6000,
                            icon: '🆕',
                            style: {
                                background: '#10b981',
                                color: '#fff',
                                fontWeight: 'bold',
                            }
                        }
                    );
                }

                if (currentApplications > lastApplicationCount) {
                    const newAppsCount = currentApplications - lastApplicationCount;
                    toast.success(
                        `🔔 ${newAppsCount} new insurance application${newAppsCount > 1 ? 's' : ''} received!`,
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
                }
            }

            // Update last counts
            setLastReportCount(newStats.total_reports || 0);
            setLastApplicationCount(newStats.total_applications || 0);

            // Set statistics
            setStats(newStats);

            // Process chart data for Reports Trend (monthly reports)
            if (data.charts?.reports_by_month) {
                const monthlyData = data.charts.reports_by_month.map(item => ({
                    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
                    reports: item.total_reports || item.count || 0,
                    resolved: item.resolved_reports || 0
                }));
                setChartData(monthlyData);
                console.log('📊 Monthly Reports Chart Data:', monthlyData);
            }

            // Process animal data for Livestock Distribution
            if (data.charts?.applications_by_type) {
                const livestockData = data.charts.applications_by_type.map(item => ({
                    type: item.animal_type_name,
                    count: item.count
                }));
                setAnimalData(livestockData);
                console.log('🐄 Livestock Distribution Data:', livestockData);
            }

            // Process disease data
            if (data.recent_reports) {
                setRecentReports(data.recent_reports);
                console.log('📋 Recent Reports:', data.recent_reports.length);

                // Group reports by disease
                const diseaseMap = {};
                data.recent_reports.forEach(report => {
                    const disease = report.disease_name_custom || report.disease?.disease_name || 'Unknown';
                    diseaseMap[disease] = (diseaseMap[disease] || 0) + 1;
                });

                const diseaseChartData = Object.entries(diseaseMap).map(([disease, count]) => ({
                    disease,
                    count
                }));
                setDiseaseData(diseaseChartData);
            }

        } catch (error) {
            console.error('❌ Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Generate time-based data based on timeRange
    const getTimeRangeData = () => {
        const now = new Date();
        const data = [];

        if (timeRange === 'daily') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                data.push({
                    label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    date: date.toISOString().split('T')[0]
                });
            }
        } else if (timeRange === 'weekly') {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - (i * 7));
                data.push({
                    label: `Week ${4 - i}`,
                    date: date.toISOString().split('T')[0]
                });
            }
        } else if (timeRange === 'monthly') {
            // Last 6 months
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - i);
                data.push({
                    label: date.toLocaleDateString('en-US', { month: 'short' }),
                    date: date.toISOString().split('T')[0]
                });
            }
        }

        return data;
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
                            <h1 className="text-3xl font-bold text-secondary-900 dark:text-gray-100">
                                Administration Dashboard 👨‍💼
                            </h1>
                            <p className="text-secondary-600 dark:text-gray-400 mt-1">
                                System overview and key metrics
                            </p>
                        </div>

                        {/* Stats Cards */}
                        {loading ? (
                            <CardSkeleton cards={5} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                                <DashboardCard
                                    icon={Users}
                                    label="Total Farmers"
                                    value={stats.total_farmers || 0}
                                    trend="Registered users"
                                    trendUp={true}
                                />
                                <DashboardCard
                                    icon={Zap}
                                    label="Total Applications"
                                    value={stats.total_applications || 0}
                                    trend={`${stats.approved_applications || 0} approved`}
                                    trendUp={true}
                                />
                                <DashboardCard
                                    icon={FileText}
                                    label="Disease Reports"
                                    value={stats.total_reports || 0}
                                    trend={`${stats.resolved_reports || 0} resolved`}
                                    trendUp={true}
                                />
                                <DashboardCard
                                    icon={AlertCircle}
                                    label="Active Advisories"
                                    value={stats.active_advisories || 0}
                                    trend="Health updates"
                                    trendUp={false}
                                />
                                <DashboardCard
                                    icon={ShieldCheck}
                                    label="Insurance Apps"
                                    value={stats.total_applications || 0}
                                    trend={`${stats.approved_applications || 0} approved`}
                                    trendUp={(stats.approved_applications || 0) > 0}
                                />
                            </div>
                        )}

                        {/* Time Range Filter */}
                        <div className="mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Time Range:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTimeRange('daily')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'daily'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setTimeRange('weekly')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'weekly'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        onClick={() => setTimeRange('monthly')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'monthly'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        Monthly
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <ChartSkeleton />
                                <ChartSkeleton />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Animals by Type */}
                                <ChartCard title={`Animal Reports (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={animalData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="type" stroke="#6b7280" />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="count" name="Count">
                                                {animalData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={animalColors[index % animalColors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartCard>

                                {/* Diseases Distribution */}
                                <ChartCard title={`Disease Reports (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={diseaseData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="disease" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="count" name="Count">
                                                {diseaseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={diseaseColors[index % diseaseColors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </div>
                        )}

                        {/* Trend Chart */}
                        <div className="mb-8">
                            <ChartCard title={`Reports Trend (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="reports"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            name="Total Reports"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="resolved"
                                            stroke="#16a34a"
                                            strokeWidth={2}
                                            name="Resolved"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        {/* Recent Reports */}
                        <ChartCard title="Recent Disease Reports">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-secondary-200">
                                            <th className="px-4 py-3 text-left font-semibold text-secondary-900">
                                                Farmer
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-secondary-900">
                                                Disease
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-secondary-900">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-secondary-900">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentReports.length > 0 ? (
                                            recentReports.map((report) => (
                                                <tr
                                                    key={report.report_id || report.id}
                                                    className="border-b border-secondary-100 hover:bg-secondary-50"
                                                >
                                                    <td className="px-4 py-3 text-secondary-700">
                                                        {report.reporter?.full_name || report.farmer || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 text-secondary-700">
                                                        {report.disease_name_custom || report.disease?.disease_name || report.disease || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 text-secondary-600">
                                                        {new Date(report.submitted_at || report.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${(report.status?.status_name || report.status)?.toLowerCase() === 'resolved'
                                                                ? 'bg-green-100 text-green-700'
                                                                : (report.status?.status_name || report.status)?.toLowerCase() === 'in progress'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                }`}
                                                        >
                                                            {report.status?.status_name || report.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-secondary-500">
                                                    No recent reports
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </ChartCard>

                        {/* Quick Actions */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <a
                                    href="/admin/reports"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-red-500 hover:shadow-card transition-all text-center"
                                >
                                    <Users className="w-8 h-8 text-primary-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900 dark:text-gray-300">Manage Users</p>
                                </a>
                                <a
                                    href="/admin/reports"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-red-500 hover:shadow-card transition-all text-center"
                                >
                                    <FileText className="w-8 h-8 text-primary-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900 dark:text-gray-300">View Reports</p>
                                </a>
                                <a
                                    href="/admin/advisories"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-red-500 hover:shadow-card transition-all text-center"
                                >
                                    <AlertCircle className="w-8 h-8 text-primary-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900 dark:text-gray-300">Manage Advisories</p>
                                </a>
                                <a
                                    href="/admin/map"
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-red-500 hover:shadow-card transition-all text-center"
                                >
                                    <Activity className="w-8 h-8 text-primary-600 dark:text-red-400 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900 dark:text-gray-300">View Map</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
