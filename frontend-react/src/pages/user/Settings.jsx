import React, { useState, useEffect } from 'react';
import { UserIcon, BellIcon, ShieldCheckIcon, KeyIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const Settings = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        barangay: '',
        sitio: '',
    });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.full_name || '',
                email: user.email || '',
                phone: user.phone_number || '',
                barangay: user.barangay || '',
                sitio: user.sitio || '',
            });
        }
    }, [user]);
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: false,
        advisoryUpdates: true,
        reportStatus: true,
    });
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await authService.updateProfile({
                full_name: profile.name,
                phone_number: profile.phone,
            });
            await successAlert('Profile Updated!', 'Your information has been saved successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        try {
            await authService.updateProfile({
                current_password: password.current,
                password: password.new,
                password_confirmation: password.confirm,
            });
            await successAlert('Password Changed!', 'Your password has been updated successfully.');
            setPassword({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleNotificationToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
        toast.success('Notification preferences updated');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Settings */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserIcon className="w-6 h-6 text-red-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                                </div>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Barangay
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.barangay}
                                                onChange={(e) => setProfile({ ...profile, barangay: e.target.value })}
                                                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sitio
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.sitio}
                                                onChange={(e) => setProfile({ ...profile, sitio: e.target.value })}
                                                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Notification Settings */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <BellIcon className="w-6 h-6 text-red-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">Email Alerts</p>
                                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('emailAlerts')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailAlerts ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">SMS Alerts</p>
                                            <p className="text-sm text-gray-600">Receive notifications via text message</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('smsAlerts')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.smsAlerts ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">Advisory Updates</p>
                                            <p className="text-sm text-gray-600">Get notified about new health advisories</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('advisoryUpdates')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.advisoryUpdates ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.advisoryUpdates ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">Report Status Updates</p>
                                            <p className="text-sm text-gray-600">Get updates on your submitted reports</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('reportStatus')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.reportStatus ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.reportStatus ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <KeyIcon className="w-6 h-6 text-red-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                                </div>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password.current}
                                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                            className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password.new}
                                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                            className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password.confirm}
                                            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                            className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Settings;
