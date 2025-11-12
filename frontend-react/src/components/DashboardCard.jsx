import React from 'react';

const DashboardCard = ({ icon: Icon, label, value, trend, trendUp = true }) => {
    return (
        <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-2">{label}</p>
                    <p className="text-3xl font-semibold text-gray-800">{value}</p>
                    {trend && (
                        <p
                            className={`text-sm mt-3 ${trendUp ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {trendUp ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-red-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
