import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import toast from 'react-hot-toast';

const InsuranceApplication = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        farmerName: '',
        barangay: '',
        municipality: 'Bansud',
        province: 'Oriental Mindoro',
        contactNumber: '',
        animalType: '',
        animalTypeOther: '',
        purpose: '',
        numberOfHeads: '',
        age: '',
        breed: '',
        basicColor: '',
        male: '',
        female: ''
    });

    const barangays = [
        'Alcadesma',
        'Bagong Silang',
        'Bangero',
        'Bato',
        'Bulo',
        'Conrazon',
        'Dayhagan',
        'Malo',
        'Manihala',
        'Pag-asa',
        'Poblacion',
        'Proper Bansud',
        'Rosacara',
        'Salcedo',
        'Santo Niño',
        'Sumagui',
        'Villa Pag-asa'
    ];

    const animalTypes = [
        { value: 'cattle', label: 'Cattle' },
        { value: 'carabao', label: 'Carabao' },
        { value: 'swine', label: 'Swine' },
        { value: 'poultry', label: 'Poultry' },
        { value: 'horse', label: 'Horse' },
        { value: 'goat', label: 'Goat' },
        { value: 'other', label: 'Other' }
    ];

    const purposes = [
        { value: 'fattening', label: 'Fattening' },
        { value: 'draft', label: 'Draft' },
        { value: 'broilers', label: 'Broilers' },
        { value: 'pullets', label: 'Pullets' },
        { value: 'breeding', label: 'Breeding' },
        { value: 'dairy', label: 'Dairy' },
        { value: 'layers', label: 'Layers' },
        { value: 'parent_stock', label: 'Parent Stock' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.farmerName || !formData.barangay || !formData.contactNumber ||
            !formData.animalType || !formData.purpose || !formData.numberOfHeads) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.animalType === 'other' && !formData.animalTypeOther) {
            toast.error('Please specify the animal type');
            return;
        }

        try {
            // Here you would typically send to backend API
            // For now, we'll store in localStorage
            const applications = JSON.parse(localStorage.getItem('insuranceApplications') || '[]');
            const newApplication = {
                id: Date.now(),
                ...formData,
                status: 'pending',
                submittedAt: new Date().toISOString(),
                animalTypeDisplay: formData.animalType === 'other' ? formData.animalTypeOther :
                    animalTypes.find(t => t.value === formData.animalType)?.label
            };
            applications.push(newApplication);
            localStorage.setItem('insuranceApplications', JSON.stringify(applications));

            toast.success('Application submitted successfully!');

            // Reset form
            setFormData({
                farmerName: '',
                barangay: '',
                municipality: 'Bansud',
                province: 'Oriental Mindoro',
                contactNumber: '',
                animalType: '',
                animalTypeOther: '',
                purpose: '',
                numberOfHeads: '',
                age: '',
                breed: '',
                basicColor: '',
                male: '',
                female: ''
            });
        } catch (error) {
            toast.error('Failed to submit application');
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Livestock Mortality Insurance
                                </h1>
                            </div>

                        </div>

                        {/* Application Form */}
                        <div className="bg-white rounded-xl shadow-card p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">
                                Application Form
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Farmer Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 text-lg">Farmer Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name of Farmer <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="farmerName"
                                            value={formData.farmerName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Barangay</label>
                                                <select
                                                    name="barangay"
                                                    value={formData.barangay}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    required
                                                >
                                                    <option value="" className="text-gray-900 bg-white">Select Barangay</option>
                                                    {barangays.map(barangay => (
                                                        <option key={barangay} value={barangay} className="text-gray-900 bg-white">
                                                            {barangay}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Municipality</label>
                                                <input
                                                    type="text"
                                                    name="municipality"
                                                    value={formData.municipality}
                                                    readOnly
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-600 mb-1">Province</label>
                                                <input
                                                    type="text"
                                                    name="province"
                                                    value={formData.province}
                                                    readOnly
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="09XX-XXX-XXXX"
                                            pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Format: 09XX-XXX-XXXX</p>
                                    </div>
                                </div>

                                {/* Type of Animal */}
                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        I. Type of Animal <span className="text-sm text-gray-500">(Choose one only)</span>
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {animalTypes.map(type => (
                                            <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="animalType"
                                                    value={type.value}
                                                    checked={formData.animalType === type.value}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                    required
                                                />
                                                <span className="text-sm text-gray-700">{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {formData.animalType === 'other' && (
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                name="animalTypeOther"
                                                value={formData.animalTypeOther}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Please specify animal type"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Purpose */}
                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        II. Purpose <span className="text-sm text-gray-500">(Choose one only)</span>
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {purposes.map(purpose => (
                                            <label key={purpose.value} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="purpose"
                                                    value={purpose.value}
                                                    checked={formData.purpose === purpose.value}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                    required
                                                />
                                                <span className="text-sm text-gray-700">{purpose.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Description of Animals */}
                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        III. Description of Animals to be Insured
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Heads <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="numberOfHeads"
                                                value={formData.numberOfHeads}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Enter number"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Age (months)
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Enter age in months"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Breed
                                            </label>
                                            <input
                                                type="text"
                                                name="breed"
                                                value={formData.breed}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Enter breed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Basic Color
                                            </label>
                                            <input
                                                type="text"
                                                name="basicColor"
                                                value={formData.basicColor}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Enter color"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Male
                                            </label>
                                            <input
                                                type="number"
                                                name="male"
                                                value={formData.male}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Number of males"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Female
                                            </label>
                                            <input
                                                type="number"
                                                name="female"
                                                value={formData.female}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Number of females"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

export default InsuranceApplication;
