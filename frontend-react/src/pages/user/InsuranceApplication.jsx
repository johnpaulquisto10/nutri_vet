import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import toast from 'react-hot-toast';
import { insuranceService, referenceService } from '../../services/api';
import { successAlert } from '../../utils/sweetAlert';

const InsuranceApplication = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [barangays, setBarangays] = useState([]);
    const [animalTypes, setAnimalTypes] = useState([]);
    const [purposes, setPurposes] = useState([]);
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

    useEffect(() => {
        fetchApplications();
        fetchReferenceData();
    }, []);

    const fetchReferenceData = async () => {
        try {
            const [barangaysRes, animalTypesRes, purposesRes] = await Promise.all([
                referenceService.getBarangays(),
                referenceService.getAnimalTypes(),
                referenceService.getAnimalPurposes()
            ]);

            setBarangays(barangaysRes.data || []);
            setAnimalTypes(animalTypesRes.data || []);
            setPurposes(purposesRes.data || []);
        } catch (error) {
            console.error('Error loading reference data:', error);
            toast.error('Failed to load form data');
        }
    };

    const fetchApplications = async () => {
        try {
            console.log('📥 User: Fetching my applications...');
            const response = await insuranceService.getAll();
            console.log('✅ User: Received response:', response.data);

            // Handle paginated response
            const applicationsData = response.data.data || response.data;
            console.log('📊 User: My applications count:', applicationsData.length);

            setMyApplications(Array.isArray(applicationsData) ? applicationsData : []);
        } catch (error) {
            console.error('❌ User: Error fetching applications:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load your applications');
        } finally {
            setLoading(false);
        }
    };

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
            console.log('📤 Submitting insurance application...');

            // Submit to backend API
            const submitData = {
                animal_type_id: parseInt(formData.animalType),
                animal_type_other: formData.animalTypeOther || null,
                purpose_id: parseInt(formData.purpose),
                barangay_id: parseInt(formData.barangay),
                contact_number: formData.contactNumber,
                number_of_heads: parseInt(formData.numberOfHeads),
                age_months: parseInt(formData.age) || 0,
                breed: formData.breed || null,
                basic_color: formData.basicColor || null,
                male_count: parseInt(formData.male) || 0,
                female_count: parseInt(formData.female) || 0,
            };

            console.log('📋 Submission data:', submitData);
            const response = await insuranceService.create(submitData);
            console.log('✅ Application submitted successfully!', response.data);

            // Show success notification with details
            await successAlert(
                'Application Submitted! 🎉',
                '',
                `<p><b>Application ID:</b> #${response.data.application?.application_id || 'Pending'}</p>
                <p><b>Status:</b> ${response.data.application?.status?.status_name || 'Pending'}</p>
                <p class="text-sm mt-2 text-gray-600">Admin will review your application soon. You will be notified once reviewed.</p>`
            );

            // Reload applications to show the new one
            console.log('🔄 Reloading applications list...');
            await fetchApplications();

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
            console.error('❌ Failed to submit application:', error);
            console.error('Error response:', error.response?.data);

            // Detailed error message
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to submit application. Please try again.';

            toast.error(
                `❌ Submission Failed\n${errorMessage}`,
                { duration: 5000 }
            );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                                                        <option key={barangay.barangay_id} value={barangay.barangay_id} className="text-gray-900 bg-white">
                                                            {barangay.barangay_name}
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
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                                            <label
                                                key={type.animal_type_id}
                                                className={`flex items-center space-x-2 cursor-pointer p-3 border-2 rounded-lg transition-all ${formData.animalType == type.animal_type_id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-primary-300 bg-white'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="animalType"
                                                    value={type.animal_type_id}
                                                    checked={formData.animalType == type.animal_type_id}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500 focus:ring-2"
                                                    required
                                                />
                                                <span className="text-sm font-medium text-gray-700">{type.animal_type_name}</span>
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
                                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                                            <label
                                                key={purpose.purpose_id}
                                                className={`flex items-center space-x-2 cursor-pointer p-3 border-2 rounded-lg transition-all ${formData.purpose == purpose.purpose_id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-primary-300 bg-white'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="purpose"
                                                    value={purpose.purpose_id}
                                                    checked={formData.purpose == purpose.purpose_id}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500 focus:ring-2"
                                                    required
                                                />
                                                <span className="text-sm font-medium text-gray-700">{purpose.purpose_name}</span>
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

                        {/* My Applications Section */}
                        <div className="bg-white rounded-2xl shadow-card p-6 mt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>

                            {loading ? (
                                <p className="text-gray-500">Loading applications...</p>
                            ) : myApplications.length === 0 ? (
                                <p className="text-gray-500">No applications submitted yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map((app) => (
                                        <div key={app.application_id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {(app.animal_type || app.animalType)?.animal_type_name || 'Other'}
                                                        {app.animal_type_other && ` (${app.animal_type_other})`}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {app.number_of_heads || 0} heads • {app.purpose?.purpose_name || 'N/A'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status?.status_name === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : app.status?.status_name === 'Rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {app.status?.status_name || 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Barangay: {app.barangay?.barangay_name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                                            </p>
                                            {app.admin_notes && (
                                                <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                                                    <strong>Admin Notes:</strong> {app.admin_notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

export default InsuranceApplication;
