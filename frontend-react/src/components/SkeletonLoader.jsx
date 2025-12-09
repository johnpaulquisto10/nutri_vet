import React from 'react';

// Table Skeleton Loader
export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
    return (
        <>
            {[...Array(rows)].map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                    {[...Array(columns)].map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

// Card Skeleton Loader
export const CardSkeleton = ({ cards = 4 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(cards)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            ))}
        </div>
    );
};

// List Skeleton Loader
export const ListSkeleton = ({ items = 5 }) => {
    return (
        <div className="space-y-4">
            {[...Array(items)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Chart Skeleton Loader
export const ChartSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-end gap-2">
                        <div
                            className="bg-gray-200 rounded"
                            style={{
                                width: '100%',
                                height: `${Math.random() * 100 + 50}px`
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Form Skeleton Loader
export const FormSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
            <div className="space-y-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index}>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                ))}
                <div className="flex justify-end gap-3 mt-8">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

// Map Skeleton Loader
export const MapSkeleton = ({ height = "400px" }) => {
    return (
        <div
            className="bg-gray-200 rounded-xl animate-pulse relative overflow-hidden"
            style={{ height }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

// Profile Skeleton Loader
export const ProfileSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
            <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index}>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Generic Skeleton Box
export const SkeletonBox = ({ width = "100%", height = "20px", className = "" }) => {
    return (
        <div
            className={`bg-gray-200 rounded animate-pulse ${className}`}
            style={{ width, height }}
        ></div>
    );
};

export default {
    TableSkeleton,
    CardSkeleton,
    ListSkeleton,
    ChartSkeleton,
    FormSkeleton,
    MapSkeleton,
    ProfileSkeleton,
    SkeletonBox
};
