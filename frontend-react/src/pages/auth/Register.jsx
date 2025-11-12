import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                role: 'farmer', // Default role for new registrations
            });

            if (result.success) {
                toast.success('Registration successful! Redirecting...');
                navigate('/user/dashboard');
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl font-bold">NV</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-secondary-900">NutriVet Bansud</h1>
                        <p className="text-secondary-600 mt-2">Create Your Account</p>
                    </div>

                    {/* Register Form */}
                    <div className="bg-white rounded-2xl shadow-card-lg border border-secondary-100 p-8">
                        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Join Us</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-secondary-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.name
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-secondary-200'
                                            }`}
                                    />
                                </div>
                                {errors.name && (
                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-secondary-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.email
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-secondary-200'
                                            }`}
                                    />
                                </div>
                                {errors.email && (
                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-secondary-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.password
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-secondary-200'
                                            }`}
                                    />
                                </div>
                                {errors.password && (
                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-secondary-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-secondary-400" />
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.password_confirmation
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-secondary-200'
                                            }`}
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2.5 rounded-lg transition-colors mt-6"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-secondary-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
