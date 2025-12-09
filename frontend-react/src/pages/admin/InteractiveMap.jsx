import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import MapView from '../../components/MapView';
import { reportService } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

const InteractiveMap = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        fetchReports();
        // Auto-refresh every 30 seconds with new report detection
        const interval = setInterval(() => {
            fetchReports(true); // check for new reports
        }, 30000);
        return () => clearInterval(interval);
    }, [reports.length]);

    const fetchReports = async (checkForNew = false) => {
        try {
            console.log('🔄 Admin Map: Fetching disease reports from API...');
            console.log('Auth Token:', localStorage.getItem('auth_token') ? 'Present ✓' : 'MISSING ✗');

            const response = await reportService.getAll();
            console.log('📥 Admin Map: API Response received');

            // Handle both paginated and non-paginated responses
            const reportsData = response.data.data || response.data;
            const newCount = reportsData.length;
            const oldCount = reports.length;

            console.log('📊 Admin Map: Reports count - Old:', oldCount, 'New:', newCount);

            // Check for new reports
            if (checkForNew && newCount > oldCount) {
                const newReportsCount = newCount - oldCount;
                toast.success(
                    `🔔 ${newReportsCount} new disease report${newReportsCount > 1 ? 's' : ''} received!`,
                    {
                        duration: 6000,
                        icon: '🆕'
                    }
                );
                console.log(`✅ Admin Map: ${newReportsCount} new reports detected!`);
            }

            if (Array.isArray(reportsData) && reportsData.length > 0) {
                const validReports = reportsData.filter(r => r.latitude && r.longitude);
                console.log(`✅ Admin Map: ${validReports.length} reports with GPS coordinates`);
            } else {
                console.warn('⚠️ Admin Map: No reports data or not an array!');
            }

            setReports(Array.isArray(reportsData) ? reportsData : []);
        } catch (error) {
            console.error('❌ Admin Map: Error fetching reports:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load disease reports');
        } finally {
            setLoading(false);
        }
    };    // Convert reports to map markers - filter out invalid coordinates
    const markers = reports
        .filter(report => {
            const lat = parseFloat(report.latitude);
            const lng = parseFloat(report.longitude);
            const isValid = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
            if (!isValid) {
                console.log('Invalid coordinates for report:', report.report_id, lat, lng);
            }
            return isValid;
        })
        .map((report) => {
            const marker = {
                id: report.report_id,
                lat: parseFloat(report.latitude),
                lng: parseFloat(report.longitude),
                label: report.disease_name_custom || report.disease?.disease_name || 'Unknown Disease',
                animalName: report.animal_name,
                description: report.description,
                date: report.report_date || report.submitted_at,
                status: report.status?.status_name?.toLowerCase() || 'pending',
                address: report.address,
                user: report.user,
            };
            console.log('Created marker:', marker);
            return marker;
        });

    // Handle marker click to show details
    const handleMarkerClick = (marker) => {
        const report = reports.find(r => r.report_id === marker.id);
        if (report) {
            setSelectedReport(report);
            setShowDetailsModal(true);
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen bg-secondary-50 dark:bg-gray-900">
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                    <main className="flex-1 overflow-auto lg:ml-64">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Reports Map</h1>
                            <p className="text-secondary-600 mb-6">Interactive map showing report locations in Bansud, Oriental Mindoro</p>

                            {loading ? (
                                <div className="flex items-center justify-center h-96">
                                    <div className="text-gray-600">Loading reports...</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4 bg-white p-4 rounded-lg shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-700">
                                                    <span className="font-semibold text-2xl text-red-600">{reports.length}</span>
                                                    <span className="ml-2">total reports</span>
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {markers.length} with valid locations • Click red pulsing dots to view details
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    🔄 Auto-refreshing every 30 seconds
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsFullScreen(true)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                                                >
                                                    <ArrowsPointingOutIcon className="w-5 h-5" />
                                                    Fullscreen
                                                </button>
                                                <button
                                                    onClick={fetchReports}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                >
                                                    Refresh Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[700px] rounded-lg overflow-hidden shadow-lg">
                                        <MapView
                                            markers={markers}
                                            center={[12.8167, 121.4667]}
                                            zoom={13}
                                            markerType="pulsing"
                                            onMarkerClick={handleMarkerClick}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Fullscreen Map Modal */}
            {isFullScreen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    {/* Fullscreen Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Reports Map - Fullscreen</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-semibold text-red-600">{reports.length}</span> total reports •
                                <span className="ml-1">{markers.length} with valid locations</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchReports}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                🔄 Refresh
                            </button>
                            <button
                                onClick={() => setIsFullScreen(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <ArrowsPointingInIcon className="w-5 h-5" />
                                Exit Fullscreen
                            </button>
                        </div>
                    </div>

                    {/* Fullscreen Map */}
                    <div className="flex-1">
                        <MapView
                            markers={markers}
                            center={[12.8167, 121.4667]}
                            zoom={13}
                            markerType="pulsing"
                            onMarkerClick={handleMarkerClick}
                        />
                    </div>
                </div>
            )}

            {/* Report Details Modal */}
            {showDetailsModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Report Details
                                </h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Status Badge */}
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status?.status_name)}`}>
                                        {selectedReport.status?.status_name || 'Pending'}
                                    </span>
                                </div>

                                {/* Report Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Disease</p>
                                        <p className="font-semibold text-gray-800">
                                            {selectedReport.disease_name_custom || selectedReport.disease?.disease_name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Animal</p>
                                        <p className="font-semibold text-gray-800">{selectedReport.animal_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Reported By</p>
                                        <p className="font-semibold text-gray-800">{selectedReport.user?.full_name || selectedReport.user?.name || 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(selectedReport.report_date || selectedReport.submitted_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Description</p>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.description}</p>
                                </div>

                                {/* Location */}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Location</p>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-gray-800 mb-1">{selectedReport.address || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">
                                            Coordinates: {parseFloat(selectedReport.latitude).toFixed(4)}, {parseFloat(selectedReport.longitude).toFixed(4)}
                                        </p>
                                    </div>
                                </div>

                                {/* Image */}
                                {selectedReport.image_url && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Image</p>
                                        <img
                                            src={selectedReport.image_url}
                                            alt="Report"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InteractiveMap;
