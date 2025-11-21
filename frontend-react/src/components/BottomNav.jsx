import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Squares2X2Icon,
    UserGroupIcon,
    DocumentTextIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const location = useLocation();
    const { role } = useAuth();

    const farmerLinks = [
        { path: '/user/dashboard', icon: Squares2X2Icon, label: 'Dashboard' },
        { path: '/user/animals', icon: UserGroupIcon, label: 'Animals' },
        { path: '/user/reports', icon: DocumentTextIcon, label: 'Reports' },
        { path: '/user/advisories', icon: ExclamationCircleIcon, label: 'Advisories' },
    ];

    const adminLinks = [
        { path: '/admin/dashboard', icon: Squares2X2Icon, label: 'Dashboard' },

        { path: '/admin/reports', icon: DocumentTextIcon, label: 'Reports' },
        { path: '/admin/advisories', icon: ExclamationCircleIcon, label: 'Advisories' },
    ];

    const links = role === 'admin' ? adminLinks : farmerLinks;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex items-center justify-around h-16">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                ? 'text-red-600'
                                : 'text-gray-600 hover:text-red-600'
                                }`}
                        >
                            <Icon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
