import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const ExportReports = () => {
    const exportPDF = async () => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const el = document.getElementById('export-area');
        if (!el) return;

        const canvas = await html2canvas(el, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save('reports-summary.pdf');
    };

    return (
        <div className="flex flex-col h-screen bg-secondary-50">
            <Navbar toggleSidebar={() => { }} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={false} toggleSidebar={() => { }} />

                <main className="flex-1 overflow-auto lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Export Reports</h1>
                        <p className="text-secondary-600 mb-6">Export analytics and report summaries as PDF</p>

                        <div id="export-area" className="bg-white p-6 rounded-2xl shadow-card border border-secondary-100">
                            <h2 className="text-xl font-semibold mb-4">Reports Summary</h2>
                            <p>This is a sample export area. Replace with actual analytics and report summaries.</p>

                            <div className="mt-6">
                                <button
                                    onClick={exportPDF}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Export as PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExportReports;
