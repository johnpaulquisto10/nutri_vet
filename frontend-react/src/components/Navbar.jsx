import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    BellIcon,
    UserIcon,
    ExclamationCircleIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/helpers';
import { confirmLogout } from '../utils/sweetAlert';

const Navbar = ({ toggleSidebar }) => {
    const { user, role, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [recentAdvisories, setRecentAdvisories] = React.useState([]);

    React.useEffect(() => {
        if (role === 'farmer') {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [role]);

    const fetchNotifications = async () => {
        try {
            const { advisoryService } = await import('../services/api');
            const [countResponse, advisoriesResponse] = await Promise.all([
                advisoryService.getUnreadCount(),
                advisoryService.getAll()
            ]);
            setUnreadCount(countResponse.data.unread_count || 0);
            const advisoriesData = advisoriesResponse.data.data || advisoriesResponse.data;
            setRecentAdvisories(Array.isArray(advisoriesData) ? advisoriesData.slice(0, 5) : []);
        } catch (error) {
            // Silently fail - backend might not be running
            console.warn('Unable to fetch notifications:', error.message);
            setUnreadCount(0);
            setRecentAdvisories([]);
        }
    };

    const handleMarkAsRead = async (advisoryId) => {
        try {
            const { advisoryService } = await import('../services/api');
            await advisoryService.markAsRead(advisoryId);
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleViewAllAdvisories = () => {
        setNotificationOpen(false);
        navigate('/user/advisories');
    };

    const handleLogout = async () => {
        const result = await confirmLogout();
        if (result.isConfirmed) {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <div className="w-8 h-8 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center transition-colors">
                                <span className="text-white text-sm font-bold">NV</span>
                            </div>
                            <span className="hidden sm:inline text-gray-800 dark:text-gray-100 transition-colors">NutriVet Bansud</span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-6">
                        {/* Theme Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <button
                                onClick={() => {
                                    console.log('🔄 Toggle clicked! Current theme:', theme);
                                    console.log('📱 HTML classes before:', document.documentElement.className);
                                    toggleTheme();
                                    setTimeout(() => {
                                        console.log('📱 HTML classes after:', document.documentElement.className);
                                        console.log('🎨 Body background:', window.getComputedStyle(document.body).backgroundColor);
                                    }, 100);
                                }}
                                className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 shadow-sm"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
                                ) : (
                                    <MoonIcon className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        </div>

                        {/* Notifications - Only for Farmers */}
                        {role === 'farmer' && (
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationOpen(!notificationOpen)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                                >
                                    <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {notificationOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setNotificationOpen(false)}
                                        ></div>

                                        {/* Dropdown Panel */}
                                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[480px] flex flex-col transition-colors">
                                            {/* Header */}
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{unreadCount} unread advisory{unreadCount !== 1 ? 'ies' : 'y'}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setNotificationOpen(false)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                </button>
                                            </div>

                                            {/* Notification List */}
                                            <div className="flex-1 overflow-y-auto">
                                                {recentAdvisories.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-8 px-4">
                                                        <BellIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No new notifications</p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {recentAdvisories.map((advisory) => (
                                                            <div
                                                                key={advisory.advisory_id}
                                                                onClick={() => handleMarkAsRead(advisory.advisory_id)}
                                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div className="flex-shrink-0">
                                                                        <div className={`p-1.5 rounded-lg ${advisory.severity?.severity_name?.toLowerCase() === 'high'
                                                                                ? 'bg-red-100 text-red-600'
                                                                                : advisory.severity?.severity_name?.toLowerCase() === 'medium'
                                                                                    ? 'bg-yellow-100 text-yellow-600'
                                                                                    : 'bg-blue-100 text-blue-600'
                                                                            }`}>
                                                                            <ExclamationCircleIcon className="w-5 h-5" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                            {advisory.title}
                                                                        </p>
                                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                                            {advisory.description}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-1.5">
                                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${advisory.severity?.severity_name?.toLowerCase() === 'high'
                                                                                    ? 'bg-red-100 text-red-700'
                                                                                    : advisory.severity?.severity_name?.toLowerCase() === 'medium'
                                                                                        ? 'bg-yellow-100 text-yellow-700'
                                                                                        : 'bg-blue-100 text-blue-700'
                                                                                }`}>
                                                                                {advisory.severity?.severity_name || 'Low'}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {new Date(advisory.created_at).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            {recentAdvisories.length > 0 && (
                                                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                                                    <button
                                                        onClick={handleViewAllAdvisories}
                                                        className="w-full text-center text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        View All Advisories
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-600 dark:bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-semibold transition-colors">
                                    {getInitials(user?.full_name || user?.name || 'User')}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user?.full_name || user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
                                </div>
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 transition-colors">
                                    <Link
                                        to="#"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        to="#"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Cog6ToothIcon className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
