import React, { useState } from 'react';
import { PlusIcon, MapPinIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import MapView from '../../components/MapView';
import toast from 'react-hot-toast';
import { initialReports } from '../../data/reportsData';

const Reports = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reports, setReports] = useState(initialReports);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [formData, setFormData] = useState({
        disease: '',
        animalName: '',
        description: '',
        barangay: '',
        sitio: '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReport = {
            id: Date.now(),
            disease: formData.disease,
            animalName: formData.animalName,
            date: new Date().toISOString().split('T')[0],
            description: formData.description,
            barangay: formData.barangay,
            sitio: formData.sitio,
            status: 'pending',
            lat: 12.8167, // Default Bansud coordinates
            lng: 121.4667,
        };

        setReports([newReport, ...reports]);
        toast.success('Report submitted successfully');
        setFormData({
            disease: '',
            animalName: '',
            description: '',
            barangay: '',
            sitio: '',
            image: null,
        });
        // Scroll to reports list
        document.getElementById('reports-list')?.scrollIntoView({ behavior: 'smooth' });
    };

    const mapMarkers = reports.map((r) => ({
        id: r.id,
        lat: r.lat,
        lng: r.lng,
        label: r.disease,
        animalName: r.animalName,
        description: r.description,
        date: r.date,
        status: r.status,
    }));

    const handleMarkerClick = (marker) => {
        const report = reports.find(r => r.id === marker.id);
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Disease Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Disease name"
                                            value={formData.disease}
                                            onChange={(e) =>
                                                setFormData({ ...formData, disease: e.target.value })
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
                                            value={formData.animalName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, animalName: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sitio *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Sitio"
                                            value={formData.sitio}
                                            onChange={(e) =>
                                                setFormData({ ...formData, sitio: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Barangay *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Barangay"
                                            value={formData.barangay}
                                            onChange={(e) =>
                                                setFormData({ ...formData, barangay: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
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
                            </form>
                        </div>

                        {/* Map */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Locations</h3>
                            <MapView markers={mapMarkers} onMarkerClick={handleMarkerClick} markerType="pin" />
                        </div>

                        {/* Submit Button */}
                        <div className="mb-8 flex justify-center">
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-lg shadow-lg"
                            >
                                Submit Report
                            </button>
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
                                                {report.disease}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Animal: {report.animalName}
                                            </p>
                                            <p className="text-secondary-700 mt-3">{report.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-secondary-500 mt-3">
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>
                                                    Lat: {report.lat.toFixed(4)}, Lng: {report.lng.toFixed(4)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-secondary-500 mt-2">
                                                {new Date(report.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${report.status === 'resolved'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
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
