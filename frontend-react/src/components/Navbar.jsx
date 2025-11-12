import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    BellIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const Navbar = ({ toggleSidebar }) => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">NV</span>
                            </div>
                            <span className="hidden sm:inline text-gray-800">NutriVet Bansud</span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                            <BellIcon className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                    {getInitials(user?.name || 'User')}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                                </div>
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <Link
                                        to="#"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        to="#"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Cog6ToothIcon className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <hr className="my-2 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
