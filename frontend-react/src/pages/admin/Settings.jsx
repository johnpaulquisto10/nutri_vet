import React, { useState } from 'react';
import { UserIcon, BellIcon, ShieldCheckIcon, KeyIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import toast from 'react-hot-toast';

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '09987654321',
        role: 'Administrator',
    });
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: true,
        newReports: true,
        criticalAlerts: true,
        userActivity: false,
    });
    const [systemSettings, setSystemSettings] = useState({
        autoApproveReports: false,
        requireEmailVerification: true,
        maintenanceMode: false,
    });
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        toast.success('Profile updated successfully');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        toast.success('Password changed successfully');
        setPassword({ current: '', new: '', confirm: '' });
    };

    const handleNotificationToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
        toast.success('Notification preferences updated');
    };

    const handleSystemSettingToggle = (key) => {
        setSystemSettings({ ...systemSettings, [key]: !systemSettings[key] });
        toast.success('System settings updated');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold text-gray-800">Admin Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Settings */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserIcon className="w-6 h-6 text-red-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Admin Profile</h2>
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
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.role}
                                                disabled
                                                className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg cursor-not-allowed"
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

                            {/* System Settings */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Cog6ToothIcon className="w-6 h-6 text-red-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">Auto-Approve Reports</p>
                                            <p className="text-sm text-gray-600">Automatically approve new disease reports</p>
                                        </div>
                                        <button
                                            onClick={() => handleSystemSettingToggle('autoApproveReports')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${systemSettings.autoApproveReports ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${systemSettings.autoApproveReports ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">Require Email Verification</p>
                                            <p className="text-sm text-gray-600">New users must verify their email address</p>
                                        </div>
                                        <button
                                            onClick={() => handleSystemSettingToggle('requireEmailVerification')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${systemSettings.requireEmailVerification ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${systemSettings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">Maintenance Mode</p>
                                            <p className="text-sm text-gray-600">Temporarily disable user access to the system</p>
                                        </div>
                                        <button
                                            onClick={() => handleSystemSettingToggle('maintenanceMode')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
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
                                            <p className="font-medium text-gray-800">New Reports</p>
                                            <p className="text-sm text-gray-600">Get notified when users submit new reports</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('newReports')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.newReports ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.newReports ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">Critical Alerts</p>
                                            <p className="text-sm text-gray-600">Urgent notifications for critical issues</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('criticalAlerts')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.criticalAlerts ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.criticalAlerts ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">User Activity</p>
                                            <p className="text-sm text-gray-600">Notifications about user registrations and activity</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('userActivity')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.userActivity ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.userActivity ? 'translate-x-6' : 'translate-x-1'
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
        </div>
    );
};

export default Settings;
