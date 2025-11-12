import React from 'react';

const ChartCard = ({ title, children, className = '' }) => {
    return (
        <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
            {title && <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>}
            <div className="w-full overflow-x-auto">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
