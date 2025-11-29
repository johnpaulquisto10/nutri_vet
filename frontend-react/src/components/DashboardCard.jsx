import React from 'react';

const DashboardCard = ({ icon: Icon, label, value, trend, trendUp = true }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
                    <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{value}</p>
                    {trend && (
                        <p
                            className={`text-sm mt-3 ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}
                        >
                            {trendUp ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-colors">
                        <Icon className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
