import React from 'react';

const ChartCard = ({ title, children, className = '' }) => {
    return (
        <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${className}`}>
            {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">{title}</h3>}
            <div className="w-full overflow-x-auto">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
