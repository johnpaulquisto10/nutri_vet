import React, { useState } from 'react';
import { ExclamationCircleIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';

const Advisories = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [advisories] = useState([
        {
            id: 1,
            title: 'Avian Influenza Alert',
            description:
                'There has been a reported increase in avian influenza cases in neighboring provinces. Ensure proper biosecurity measures and monitor your birds closely.',
            severity: 'high',
            date: '2025-11-10',
            category: 'Disease Alert',
        },
        {
            id: 2,
            title: 'Seasonal Vaccination Update',
            description:
                'It is now the recommended season for cattle vaccinations. Contact your veterinarian to schedule vaccinations for your herd.',
            severity: 'medium',
            date: '2025-11-08',
            category: 'Vaccination',
        },
        {
            id: 3,
            title: 'Feed Quality Standards',
            description:
                'New regulations on livestock feed quality have been implemented. Ensure your feed suppliers meet the new standards.',
            severity: 'medium',
            date: '2025-11-05',
            category: 'Feed Management',
        },
        {
            id: 4,
            title: 'Water Supply Safety',
            description:
                'Maintain clean water sources for your livestock to prevent waterborne diseases. Test water regularly.',
            severity: 'low',
            date: '2025-11-01',
            category: 'Health & Safety',
        },
        {
            id: 5,
            title: 'Mastitis Prevention Guidelines',
            description:
                'New guidelines released for mastitis prevention in dairy cattle. Implement proper milking hygiene practices.',
            severity: 'high',
            date: '2025-10-28',
            category: 'Disease Prevention',
        },
    ]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'border-red-200 bg-red-50';
            case 'medium':
                return 'border-yellow-200 bg-yellow-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    const getSeverityBadge = (severity) => {
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
                        <div className="space-y-4">
                            {advisories.map((advisory) => (
                                <div
                                    key={advisory.id}
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
                                                        {advisory.category}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getSeverityBadge(
                                                        advisory.severity
                                                    )}`}
                                                >
                                                    {advisory.severity.charAt(0).toUpperCase() +
                                                        advisory.severity.slice(1)}{' '}
                                                    Priority
                                                </span>
                                            </div>

                                            <p className="mt-3 text-gray-700 leading-relaxed">
                                                {advisory.description}
                                            </p>

                                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {new Date(advisory.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon className="w-4 h-4" />
                                                    {new Date(advisory.date).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </div>

                                            <button className="mt-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                                                Read More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

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
