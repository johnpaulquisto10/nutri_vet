import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import MapView from '../../components/MapView';
import { initialReports } from '../../data/reportsData';

const InteractiveMap = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Convert reports to map markers
    const markers = initialReports.map((report) => ({
        id: report.id,
        lat: report.lat,
        lng: report.lng,
        label: report.disease,
        animalName: report.animalName,
        description: report.description,
        date: report.date,
        status: report.status,
    }));

    return (
        <div className="flex flex-col h-screen bg-secondary-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Reports Map</h1>
                        <p className="text-secondary-600 mb-6">Interactive map showing report locations in Bansud, Oriental Mindoro</p>

                        <MapView markers={markers} center={[12.8167, 121.4667]} zoom={13} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InteractiveMap;
