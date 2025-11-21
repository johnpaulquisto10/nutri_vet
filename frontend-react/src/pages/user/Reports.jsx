import React, { useState, useEffect } from 'react';
import { PlusIcon, MapPinIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import MapView from '../../components/MapView';
import toast from 'react-hot-toast';
import { reportService, referenceService } from '../../services/api';

const Reports = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [location, setLocation] = useState({ lat: 12.8167, lng: 121.4667 });
    const [address, setAddress] = useState('Click on the map to set location');
    const [formData, setFormData] = useState({
        disease_name: '',
        animal_name: '',
        description: '',
        image: null,
    });

    // Load reports on mount
    useEffect(() => {
        fetchReports();
        getCurrentLocation();
    }, []);

    // Get user's current location automatically
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            toast.loading('Getting your location...', { id: 'location' });
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    getAddressFromCoords(latitude, longitude);
                    toast.success('Location detected successfully', { id: 'location' });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Could not get your location. Please click on the map to set it manually.', { id: 'location' });
                    // Keep default location
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };

    const fetchReports = async () => {
        try {
            console.log('📥 User: Fetching my disease reports...');
            const response = await reportService.getAll();
            // Handle paginated response
            const reportsData = response.data.data || response.data;
            console.log('✅ User: Loaded', reportsData.length, 'disease reports');
            setReports(Array.isArray(reportsData) ? reportsData : []);
        } catch (error) {
            console.error('❌ User: Error fetching reports:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load your reports');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('disease_id', 1); // Default disease ID
        submitData.append('disease_name_custom', formData.disease_name);
        submitData.append('animal_name', formData.animal_name);
        submitData.append('description', formData.description);
        submitData.append('address', address);
        submitData.append('latitude', location.lat);
        submitData.append('longitude', location.lng);
        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            console.log('📤 Submitting disease report...');
            const response = await reportService.create(submitData);
            console.log('✅ Report submitted successfully!', response.data);

            toast.success(
                `🎉 Disease report submitted successfully!\n` +
                `Report ID: ${response.data.report?.report_id || 'Pending'}\n` +
                `Status: ${response.data.report?.status?.status_name || 'Submitted'}\n` +
                `Your report will appear on the admin map shortly.`,
                { duration: 5000 }
            );

            setFormData({
                disease_name: '',
                animal_name: '',
                description: '',
                image: null,
            });
            setLocation({ lat: 12.8167, lng: 121.4667 });
            setAddress('Click on the map to set location');

            console.log('🔄 Reloading reports list...');
            fetchReports(); // Refresh reports list

            // Scroll to reports list
            document.getElementById('reports-list')?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('❌ Failed to submit report:', error);
            console.error('Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to submit report. Please try again.';

            toast.error(
                `❌ Submission Failed\n${errorMessage}`,
                { duration: 5000 }
            );
        }
    };

    // Function to get address from coordinates using reverse geocoding
    const getAddressFromCoords = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data.display_name) {
                setAddress(data.display_name);
            } else {
                setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }
    };

    // Handle map click to set location
    const handleMapClick = (lat, lng) => {
        setLocation({ lat, lng });
        getAddressFromCoords(lat, lng);
    };

    // Show only submitted reports as markers (no user pin until report is submitted)
    const mapMarkers = reports.map((r) => ({
        id: r.report_id,
        lat: parseFloat(r.latitude),
        lng: parseFloat(r.longitude),
        label: r.disease?.disease_name || r.disease_name_custom || 'Unknown Disease',
        animalName: r.animal_name,
        description: r.description,
        date: r.report_date || r.submitted_at,
        status: r.status?.status_name?.toLowerCase() || 'pending',
    }));

    const handleMarkerClick = (marker) => {
        const report = reports.find(r => r.report_id === marker.id);
        if (report) {
            setSelectedReport(report);
            setShowDetailsModal(true);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold text-gray-800">Disease Reports</h1>
                            <p className="text-gray-600 mt-1">Submit and track disease reports</p>
                        </div>

                        {/* Report Form */}
                        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Submit New Report</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Disease Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter disease name (e.g., Foot and Mouth Disease, Bird Flu)"
                                        value={formData.disease_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, disease_name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Animal Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Animal name"
                                        value={formData.animal_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, animal_name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        placeholder="Describe symptoms..."
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows="3"
                                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location Address
                                    </label>
                                    <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700 leading-relaxed">{address}</p>
                                            <p className="text-xs text-gray-500 mt-1">Click on the map below to set the exact location</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attach Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setFormData({ ...formData, image: e.target.files?.[0] })
                                            }
                                            className="w-full text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Submit Report
                                </button>
                            </form>
                        </div>

                        {/* Map */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Your Location
                                <span className="text-sm font-normal text-gray-600 ml-2">(Auto-detected. Click map to adjust if needed)</span>
                            </h3>
                            <MapView
                                markers={mapMarkers}
                                onMarkerClick={handleMarkerClick}
                                onMapClick={handleMapClick}
                                markerType="pin"
                                center={[location.lat, location.lng]}
                            />
                        </div>

                        {/* Reports List */}
                        <div id="reports-list" className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Your Reports</h3>
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {report.disease_name_custom || report.disease?.disease_name || 'Unknown Disease'}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Animal: {report.animal_name}
                                            </p>
                                            <p className="text-secondary-700 mt-3">{report.description}</p>
                                            {report.latitude && report.longitude && (
                                                <div className="flex items-center gap-2 text-sm text-secondary-500 mt-3">
                                                    <MapPinIcon className="w-4 h-4" />
                                                    <span>
                                                        Lat: {parseFloat(report.latitude).toFixed(4)}, Lng: {parseFloat(report.longitude).toFixed(4)}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-sm text-secondary-500 mt-2">
                                                {new Date(report.report_date || report.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${(report.status?.status_name || report.status)?.toLowerCase() === 'resolved'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {report.status?.status_name || report.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Report Details Modal */}
                        {showDetailsModal && selectedReport && (
                            <div className="fixed inset-0 z-50 overflow-y-auto">
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                                    onClick={() => setShowDetailsModal(false)}
                                ></div>

                                {/* Modal */}
                                <div className="flex items-center justify-center min-h-screen p-3 sm:p-4">
                                    <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-sm sm:max-w-2xl p-4 sm:p-8 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto">
                                        {/* Close button */}
                                        <button
                                            onClick={() => setShowDetailsModal(false)}
                                            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Content */}
                                        <div className="space-y-4 sm:space-y-6 pr-8">
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                                                    {selectedReport.disease}
                                                </h2>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${selectedReport.status === 'resolved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(selectedReport.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Animal</h3>
                                                    <p className="text-gray-600">{selectedReport.animalName}</p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                                                    <p className="text-gray-600 leading-relaxed">{selectedReport.description}</p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Location</h3>
                                                    <div className="flex items-start gap-2 text-gray-600">
                                                        <MapPinIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p>Sitio: {selectedReport.sitio}</p>
                                                            <p>Barangay: {selectedReport.barangay}</p>
                                                            <p className="text-sm text-gray-500 mt-1">Bansud, Oriental Mindoro</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 sm:pt-6 border-t border-gray-200">
                                                <button
                                                    onClick={() => setShowDetailsModal(false)}
                                                    className="w-full px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Reports;
