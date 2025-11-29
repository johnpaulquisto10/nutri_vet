import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    XMarkIcon,
    Squares2X2Icon,
    Cog6ToothIcon,
    ChartBarIcon,
    ExclamationCircleIcon,
    UsersIcon,
    DocumentTextIcon,
    MapIcon,
    ArrowDownTrayIcon,
    BoltIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { role } = useAuth();

    const isActive = (path) => location.pathname.startsWith(path);

    const navItems =
        role === 'admin'
            ? [
                {
                    label: 'Dashboard',
                    icon: Squares2X2Icon,
                    path: '/admin/dashboard',
                },
                {
                    label: 'Reports',
                    icon: DocumentTextIcon,
                    path: '/admin/reports',
                },
                {
                    label: 'Advisories',
                    icon: ExclamationCircleIcon,
                    path: '/admin/advisories',
                },
                {
                    label: 'Map',
                    icon: MapIcon,
                    path: '/admin/map',
                },
                {
                    label: 'Insurance',
                    icon: ShieldCheckIcon,
                    path: '/admin/insurance',
                },
            ]
            : [
                {
                    label: 'Dashboard',
                    icon: Squares2X2Icon,
                    path: '/user/dashboard',
                },
                {
                    label: 'Insured Animals',
                    icon: BoltIcon,
                    path: '/user/animals',
                },
                {
                    label: 'Reports',
                    icon: DocumentTextIcon,
                    path: '/user/reports',
                },
                {
                    label: 'Advisories',
                    icon: ExclamationCircleIcon,
                    path: '/user/advisories',
                },
                {
                    label: 'Insurance',
                    icon: ShieldCheckIcon,
                    path: '/user/insurance',
                },
            ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Mobile close button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-600 dark:text-gray-300 z-50 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Navigation items */}
                <nav className="pt-6 pb-20 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => toggleSidebar()}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
                    <Link
                        to={role === 'admin' ? '/admin/settings' : '/user/settings'}
                        onClick={() => toggleSidebar()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(role === 'admin' ? '/admin/settings' : '/user/settings')
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                    >
                        <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">Settings</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
