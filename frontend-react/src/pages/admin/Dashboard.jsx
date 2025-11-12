import React, { useState, useEffect } from 'react';
import {
    Users,
    Zap,
    FileText,
    AlertCircle,
    TrendingUp,
    Activity,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
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
} from 'recharts';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 156,
        totalAnimals: 892,
        totalReports: 342,
        activeAdvisories: 5,
    });

    const [chartData] = useState([
        { month: 'Jan', reports: 45, resolved: 42 },
        { month: 'Feb', reports: 52, resolved: 48 },
        { month: 'Mar', reports: 48, resolved: 45 },
        { month: 'Apr', reports: 61, resolved: 56 },
        { month: 'May', reports: 55, resolved: 52 },
        { month: 'Jun', reports: 67, resolved: 65 },
    ]);

    const [animalData] = useState([
        { type: 'Cattle', count: 456 },
        { type: 'Goat', count: 234 },
        { type: 'Pig', count: 145 },
        { type: 'Poultry', count: 57 },
    ]);

    const [recentReports] = useState([
        {
            id: 1,
            farmer: 'Juan Dela Cruz',
            disease: 'Foot and Mouth Disease',
            date: '2025-11-10',
            status: 'pending',
        },
        {
            id: 2,
            farmer: 'Maria Santos',
            disease: 'Pneumonia',
            date: '2025-11-09',
            status: 'in-progress',
        },
        {
            id: 3,
            farmer: 'Pedro Lopez',
            disease: 'Mastitis',
            date: '2025-11-08',
            status: 'resolved',
        },
        {
            id: 4,
            farmer: 'Ana Garcia',
            disease: 'Avian Influenza',
            date: '2025-11-07',
            status: 'pending',
        },
    ]);

    return (
        <div className="flex flex-col h-screen bg-secondary-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-secondary-900">
                                Administration Dashboard 👨‍💼
                            </h1>
                            <p className="text-secondary-600 mt-1">
                                System overview and key metrics
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <DashboardCard
                                icon={Users}
                                label="Total Users"
                                value={stats.totalUsers}
                                trend="12 new this month"
                                trendUp={true}
                            />
                            <DashboardCard
                                icon={Zap}
                                label="Total Livestock"
                                value={stats.totalAnimals}
                                trend="156 added"
                                trendUp={true}
                            />
                            <DashboardCard
                                icon={FileText}
                                label="Disease Reports"
                                value={stats.totalReports}
                                trend="95% resolved"
                                trendUp={true}
                            />
                            <DashboardCard
                                icon={AlertCircle}
                                label="Active Advisories"
                                value={stats.activeAdvisories}
                                trend="2 critical"
                                trendUp={false}
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Reports Trend */}
                            <div className="lg:col-span-2">
                                <ChartCard title="Reports & Resolution Trend (Last 6 Months)">
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

                            {/* Livestock Distribution */}
                            <ChartCard title="Livestock Distribution">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={animalData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" stroke="#6b7280" />
                                        <YAxis
                                            dataKey="type"
                                            type="category"
                                            width={80}
                                            stroke="#6b7280"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#22c55e" name="Count" />
                                    </BarChart>
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
                                        {recentReports.map((report) => (
                                            <tr
                                                key={report.id}
                                                className="border-b border-secondary-100 hover:bg-secondary-50"
                                            >
                                                <td className="px-4 py-3 text-secondary-700">
                                                    {report.farmer}
                                                </td>
                                                <td className="px-4 py-3 text-secondary-700">
                                                    {report.disease}
                                                </td>
                                                <td className="px-4 py-3 text-secondary-600">
                                                    {new Date(report.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${report.status === 'resolved'
                                                                ? 'bg-green-100 text-green-700'
                                                                : report.status === 'in-progress'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {report.status
                                                            .split('-')
                                                            .map(
                                                                (word) =>
                                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                            )
                                                            .join(' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ChartCard>

                        {/* Quick Actions */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <a
                                    href="/admin/users"
                                    className="p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-500 hover:shadow-card transition-all text-center"
                                >
                                    <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900">Manage Users</p>
                                </a>
                                <a
                                    href="/admin/reports"
                                    className="p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-500 hover:shadow-card transition-all text-center"
                                >
                                    <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900">View Reports</p>
                                </a>
                                <a
                                    href="/admin/advisories"
                                    className="p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-500 hover:shadow-card transition-all text-center"
                                >
                                    <AlertCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900">Manage Advisories</p>
                                </a>
                                <a
                                    href="/admin/map"
                                    className="p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-500 hover:shadow-card transition-all text-center"
                                >
                                    <Activity className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                    <p className="font-medium text-secondary-900">View Map</p>
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
