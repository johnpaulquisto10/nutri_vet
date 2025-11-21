import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon, ArrowRightIcon, CheckCircleIcon, XMarkIcon, Bars3Icon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    // Scroll sections handler
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = document.querySelectorAll('.hero-section');
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    setCurrentSection(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const validateLoginForm = () => {
        const newErrors = {};

        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(loginData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!loginData.password) {
            newErrors.password = 'Password is required';
        } else if (loginData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegisterForm = () => {
        const newErrors = {};

        if (!registerData.name) {
            newErrors.name = 'Name is required';
        }

        if (!registerData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(registerData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!registerData.password) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!registerData.passwordConfirm) {
            newErrors.passwordConfirm = 'Please confirm password';
        } else if (registerData.password !== registerData.passwordConfirm) {
            newErrors.passwordConfirm = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
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

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({
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

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

        setLoading(true);
        try {
            const result = await login(loginData.email, loginData.password);

            if (result.success) {
                toast.success('Login successful!');
                setShowModal(false);
                // Redirect based on role
                if (result.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!validateRegisterForm()) {
            return;
        }

        setLoading(true);
        try {
            const result = await register(registerData);

            if (result.success) {
                toast.success('Account created successfully!');
                setShowModal(false);
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

    const sections = [
        { id: 1, label: 'Education' },
        { id: 2, label: 'Diagnostics' },
        { id: 3, label: 'MSI' },
        { id: 4, label: 'Euthanization' }
    ];

    return (
        <>
            <Toaster />
            <div className="min-h-screen bg-slate-900 text-white">

                {/* Fixed Top Navigation */}
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-gray-100'
                        : 'bg-white/95 backdrop-blur-sm shadow-sm'
                    }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="flex items-center justify-between h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                                        <span className="text-white font-bold text-xl">NV</span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-2xl font-bold text-gray-900 tracking-tight">NutriVet</span>
                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">Bansud</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Livestock Health Management</p>
                                </div>
                            </div>

                            {/* Center Nav Links */}
                            <div className="hidden lg:flex items-center gap-1">
                                <a href="#section-1" className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">Education</a>
                                <a href="#section-3" className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">Diagnostics</a>
                                <a href="#section-4" className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">MSI</a>
                                <a href="#section-5" className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">Euthanization</a>
                                <a href="#about" className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">About Us</a>
                            </div>

                            {/* Right Side - Login & Mobile Menu */}
                            <div className="flex items-center gap-3">
                                {/* Sign In Button */}
                                <button
                                    onClick={() => {
                                        setActiveTab('login');
                                        setShowModal(true);
                                    }}
                                    className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    <LockClosedIcon className="w-5 h-5" />
                                    Sign In
                                </button>

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    {mobileMenuOpen ? (
                                        <XMarkIcon className="w-6 h-6" />
                                    ) : (
                                        <Bars3Icon className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden border-t border-gray-100 py-4 space-y-2">
                                <a href="#section-1" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">Education</a>
                                <a href="#section-3" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">Diagnostics</a>
                                <a href="#section-4" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">MSI</a>
                                <a href="#section-5" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">Euthanization</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">About Us</a>
                                <button
                                    onClick={() => {
                                        setActiveTab('login');
                                        setShowModal(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg mt-3"
                                >
                                    <LockClosedIcon className="w-5 h-5" />
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Left Side Navigation Numbers */}
                <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
                    <div className="flex flex-col gap-4">
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    const element = document.getElementById(`section-${section.id}`);
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${currentSection === index
                                    ? 'bg-red-600 text-white shadow-lg scale-110'
                                    : 'bg-white/10 text-gray-400 hover:bg-red-600/20 hover:text-red-600 border border-gray-600/30'
                                    }`}
                            >
                                0{section.id}
                            </button>
                        ))}
                        <div className="w-px h-20 bg-red-600/30 mx-auto mt-2"></div>
                    </div>
                </div>

                {/* Hero Sections */}
                <div>

                    {/* Section 1 - Education */}
                    <section id="section-1" className="hero-section relative min-h-screen flex items-center overflow-hidden pt-20">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center" style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1600&h=900&fit=crop)',
                            filter: 'brightness(0.4)'
                        }}></div>

                        {/* Content */}
                        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
                            <div className="max-w-2xl mb-32">
                                <h1 className="text-6xl lg:text-7xl font-light text-white mb-6">Education</h1>
                                <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                                    Our section is dedicated to enhancing the skills and knowledge of individuals involved in livestock management and veterinary science in Bansud, ensuring our local expertise is competitive and valuable.
                                </p>

                            </div>

                            {/* Bottom Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-white">
                                    <h3 className="font-semibold mb-2">Undergraduate Studies</h3>
                                    <p className="text-sm text-gray-400">Master of Veterinary Medicine</p>
                                    <p className="text-sm text-gray-400">Bachelor of Veterinary Medicine</p>
                                </div>
                                <div className="text-white">
                                    <h3 className="font-semibold mb-2">Postgraduate studies</h3>
                                    <p className="text-sm text-gray-400">PhD Degree in Veterinary Medicine</p>
                                    <p className="text-sm text-gray-400">Specializations in 8 branches</p>
                                </div>
                                <div className="text-white">
                                    <h3 className="font-semibold mb-2">Professional development</h3>
                                    <p className="text-sm text-gray-400">Short courses for veterinarians</p>
                                    <p className="text-sm text-gray-400">Courses, Praktika, Small Animals</p>
                                </div>
                                <div className="text-white">
                                    <h3 className="font-semibold mb-2">Permanent education</h3>
                                    <p className="text-sm text-gray-400">Training lectures, Virtual farm</p>
                                    <p className="text-sm text-gray-400">Hands-on workshops</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 - Diagnostics */}
                    <section id="section-3" className="hero-section relative min-h-screen flex items-center overflow-hidden">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center" style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop)',
                            filter: 'brightness(0.4)'
                        }}></div>

                        {/* Content */}
                        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
                            <div className="max-w-2xl">
                                <h1 className="text-6xl lg:text-7xl font-light text-white mb-6">Diagnostics</h1>
                                <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                                    Advanced laboratory services and diagnostic imaging for accurate animal health assessments.
                                </p>

                            </div>
                        </div>
                    </section>

                    {/* Section 4 - MSI */}
                    <section id="section-4" className="hero-section relative min-h-screen flex items-center overflow-hidden">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center" style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=1600&h=900&fit=crop)',
                            filter: 'brightness(0.4)'
                        }}></div>

                        {/* Content */}
                        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
                            <div className="max-w-2xl">
                                <h1 className="text-6xl lg:text-7xl font-light text-white mb-6">MSI</h1>
                                <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                                    Medical Services and Innovation for the future of veterinary care in the Philippines.
                                </p>

                            </div>
                        </div>
                    </section>

                    {/* Section 5 - Euthanization */}
                    <section id="section-5" className="hero-section relative min-h-screen flex items-center overflow-hidden">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center" style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&h=900&fit=crop)',
                            filter: 'brightness(0.4)'
                        }}></div>

                        {/* Content */}
                        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
                            <div className="max-w-2xl">
                                <h1 className="text-6xl lg:text-7xl font-light text-white mb-6">Euthanization</h1>
                                <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                                    Compassionate end-of-life care services provided with dignity and respect for your animals.
                                </p>
                                <button

                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition-all"
                                >
                                    CONTACT US

                                </button>

                                {/* Contact Information */}
                                <div className="mt-8 space-y-2">
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        sonnyboymanato@yahoo.com
                                    </p>
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        0928-837-1771
                                    </p>
                                </div>

                            </div>

                        </div>
                    </section>

                    {/* About Us Section */}
                    <section id="about" className="bg-white py-20">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12">
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                        Department of Agriculture – Bansud, Oriental Mindoro
                                    </h2>
                                    <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                                </div>

                                <div className="space-y-6 text-gray-700 leading-relaxed">
                                    <p className="text-lg">
                                        DA Bansud gives direct support to local farmers and livestock owners. The office provides field assistance, vet guidance, and farm monitoring to improve livestock health and daily farm operations in the municipality.
                                    </p>

                                    <div className="bg-gray-50 rounded-xl p-8 my-8">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Main Services</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Livestock management support</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Vet assistance and disease control</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Field visits and farm checks</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Farm inputs when available</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Trainings and info sessions</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Livestock monitoring in barangays</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Support for DA MIMAROPA and LGU projects</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-lg text-center text-gray-800 font-medium">
                                        DA Bansud works with the community to keep farms healthy, safe, and productive for all farmers in Bansud.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="bg-slate-900 border-t border-gray-800 text-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            {/* Brand Column */}
                            <div className="md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">NV</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-white">NutriVet</div>
                                        <p className="text-xs text-gray-400">Livestock Health</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-6">Empowering Filipino farmers with smart livestock management solutions.</p>
                            </div>

                            {/* Services Column */}
                            <div>
                                <h3 className="font-semibold text-white mb-4">Services</h3>
                                <ul className="space-y-2">
                                    <li><a href="#education" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Education</a></li>
                                    <li><a href="#diagnostics" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Diagnostics</a></li>
                                    <li><a href="#msi" className="text-gray-400 hover:text-red-600 transition-colors text-sm">MSI</a></li>
                                </ul>
                            </div>

                            {/* Support Column */}
                            <div>
                                <h3 className="font-semibold text-white mb-4">Support</h3>
                                <ul className="space-y-2">
                                    <li><a href="#contact" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Contact</a></li>
                                    <li><a href="#faq" className="text-gray-400 hover:text-red-600 transition-colors text-sm">FAQ</a></li>
                                    <li><a href="#help" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Help Center</a></li>
                                    <li><a href="#careers" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Careers</a></li>
                                </ul>
                            </div>

                            {/* Legal Column */}
                            <div>
                                <h3 className="font-semibold text-white mb-4">Legal</h3>
                                <ul className="space-y-2">
                                    <li><a href="#privacy" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Privacy Policy</a></li>
                                    <li><a href="#terms" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Terms of Service</a></li>
                                    <li><a href="#cookies" className="text-gray-400 hover:text-red-600 transition-colors text-sm">Cookies</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Footer */}
                        <div className="border-t border-gray-800 pt-8 mt-8">
                            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                                <p>&copy; 2025 NutriVet Bansud. All rights reserved.</p>
                                <p>Built with care for Filipino farmers 🇵🇭</p>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Auth Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-gradient-to-br from-red-900/40 via-slate-900/60 to-green-900/40 backdrop-blur-md transition-opacity"
                            onClick={() => setShowModal(false)}
                        ></div>

                        {/* Modal Content */}
                        <div className="flex items-center justify-center min-h-screen px-4 py-8">
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-8 relative animate-fadeIn">
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                                >
                                    <XMarkIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                {/* Modal Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
                                        <LockClosedIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {activeTab === 'login' ? 'Sign in to access your account' : 'Join NutriVet Bansud community'}
                                    </p>
                                </div>

                                {/* Modal Body */}
                                <div>
                                    {/* LOGIN TAB */}
                                    {activeTab === 'login' && (
                                        <div>
                                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                                {/* Email Field */}
                                                <div>
                                                    <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="login-email"
                                                            type="email"
                                                            name="email"
                                                            value={loginData.email}
                                                            onChange={handleLoginChange}
                                                            placeholder="your@email.com"
                                                            className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${errors.email
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Password Field */}
                                                <div>
                                                    <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Password
                                                    </label>
                                                    <div className="relative">
                                                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="login-password"
                                                            type={showLoginPassword ? "text" : "password"}
                                                            name="password"
                                                            value={loginData.password}
                                                            onChange={handleLoginChange}
                                                            placeholder="Enter your password"
                                                            className={`w-full pl-10 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${errors.password
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {showLoginPassword ? (
                                                                <EyeSlashIcon className="w-5 h-5" />
                                                            ) : (
                                                                <EyeIcon className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {errors.password && (
                                                        <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" />
                                                            {errors.password}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Sign In Button */}
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl transition-all font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            Signing in...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Sign In
                                                            <ArrowRightIcon className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>

                                                {/* Links */}
                                                <div className="mt-6 space-y-3">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-gray-200"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                            <span className="px-4 bg-white text-gray-500">or</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveTab('register')}
                                                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            Don't have an account? <span className="text-red-600 hover:text-red-700 font-semibold">Sign up</span>
                                                        </button>
                                                    </div>
                                                    <div className="text-center">
                                                        <a href="#" className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                                                            Forgot password?
                                                        </a>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* REGISTER TAB */}
                                    {activeTab === 'register' && (
                                        <div>
                                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                                {/* Name Field */}
                                                <div>
                                                    <label htmlFor="reg-name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        id="reg-name"
                                                        type="text"
                                                        name="name"
                                                        value={registerData.name}
                                                        onChange={handleRegisterChange}
                                                        placeholder="Juan Dela Cruz"
                                                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${errors.name
                                                            ? 'border-red-300 bg-red-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" />
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Email Field */}
                                                <div>
                                                    <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="reg-email"
                                                            type="email"
                                                            name="email"
                                                            value={registerData.email}
                                                            onChange={handleRegisterChange}
                                                            placeholder="your@email.com"
                                                            className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${errors.email
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Password Field */}
                                                <div>
                                                    <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Password
                                                    </label>
                                                    <div className="relative">
                                                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="reg-password"
                                                            type={showRegPassword ? "text" : "password"}
                                                            name="password"
                                                            value={registerData.password}
                                                            onChange={handleRegisterChange}
                                                            placeholder="Create a strong password"
                                                            className={`w-full pl-10 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${errors.password
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowRegPassword(!showRegPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {showRegPassword ? (
                                                                <EyeSlashIcon className="w-5 h-5" />
                                                            ) : (
                                                                <EyeIcon className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {errors.password && (
                                                        <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" />
                                                            {errors.password}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Confirm Password Field */}
                                                <div>
                                                    <label htmlFor="reg-confirm" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Confirm Password
                                                    </label>
                                                    <div className="relative">
                                                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            id="reg-confirm"
                                                            type={showRegConfirmPassword ? "text" : "password"}
                                                            name="passwordConfirm"
                                                            value={registerData.passwordConfirm}
                                                            onChange={handleRegisterChange}
                                                            placeholder="Re-enter your password"
                                                            className={`w-full pl-10 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${errors.passwordConfirm
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {showRegConfirmPassword ? (
                                                                <EyeSlashIcon className="w-5 h-5" />
                                                            ) : (
                                                                <EyeIcon className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {errors.passwordConfirm && (
                                                        <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" />
                                                            {errors.passwordConfirm}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Sign Up Button */}
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl transition-all font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            Creating account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Create Account
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>

                                                {/* Links */}
                                                <div className="mt-6 space-y-3">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-gray-200"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                            <span className="px-4 bg-white text-gray-500">or</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveTab('login')}
                                                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            Already have an account? <span className="text-red-600 hover:text-red-700 font-semibold">Sign in</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Modal Content Container Closing */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Login;
