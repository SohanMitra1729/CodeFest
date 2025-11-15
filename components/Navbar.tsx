
import React, { useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { NavLink } from '../types';
import { useAuth } from '../hooks/useAuth';

const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Rounds', path: '/rounds' },
    { name: 'Prizes', path: '/prizes' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logoVariant, setLogoVariant] = useState(0); // 0: Hack Sphere, 1: Code Fest, 2: Dev Quest
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const logoVariants = [
        { name: 'CODE FEST', subtitle: 'Innovation Hub', emoji: '💻' },
        { name: 'HACK SPHERE', subtitle: '2026 Edition', emoji: '⚡' },
        { name: 'DEV QUEST', subtitle: 'Challenge Mode', emoji: '🚀' },
    ];

    const currentLogo = logoVariants[logoVariant];
    
    const AuthButtons: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
        if (user) {
            return (
                <div className={`flex items-center gap-3 ${isMobile ? 'flex-col w-full' : ''}`}>
                    <RouterNavLink to="/dashboard" className="bg-gradient-to-r from-[#E23C60] to-[#D1184E] hover:from-[#E23C60]/90 hover:to-[#D1184E]/90 text-white font-bold py-2.5 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-[#E23C60]/50 duration-300 inline-block">
                        Dashboard
                    </RouterNavLink>
                    <button onClick={handleLogout} className="text-gray-300 hover:text-[#E23C60] font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-white/10">
                        Logout
                    </button>
                </div>
            );
        }
        return (
            <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
                <RouterNavLink to="/login" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-[#E23C60] hover:bg-white/10 transition-all duration-200 inline-block">
                    Login
                </RouterNavLink>
                <RouterNavLink to="/signup" className="bg-gradient-to-r from-[#E23C60] to-[#D1184E] hover:from-[#E23C60]/90 hover:to-[#D1184E]/90 text-white font-bold py-2.5 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-[#E23C60]/50 duration-300 inline-block">
                    Sign Up
                </RouterNavLink>
            </div>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-b border-[#E23C60]/30 shadow-2xl shadow-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <RouterNavLink to="/" className="flex items-center gap-2.5 group" onClick={() => setLogoVariant((v) => (v + 1) % logoVariants.length)}>
                        <div className="relative">
                            {/* Badge with gradient */}
                            <div className="bg-gradient-to-br from-[#E23C60] via-[#D1184E] to-[#B21245] rounded-xl p-2.5 group-hover:shadow-2xl group-hover:shadow-[#E23C60]/50 transition-all duration-300 transform group-hover:scale-110">
                                <div className="flex items-center justify-center">
                                    <span className="text-white font-black text-2xl">{currentLogo.emoji}</span>
                                </div>
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E23C60]/40 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex flex-col gap-0">
                            <span className="font-black text-lg leading-tight text-white group-hover:text-[#E23C60] transition-colors">{currentLogo.name}</span>
                            <span className="text-xs font-bold text-[#E23C60] uppercase tracking-wider">{currentLogo.subtitle}</span>
                        </div>
                    </RouterNavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <RouterNavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-[#E23C60] text-white shadow-lg shadow-[#E23C60]/40' 
                                        : 'text-gray-300 hover:text-[#E23C60] hover:bg-white/10'
                                }`}
                            >
                                {link.name}
                            </RouterNavLink>
                        ))}
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        <AuthButtons />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-300 hover:text-[#E23C60] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#E23C60]/30 transition-all"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-[#E23C60]/20 bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-xl">
                    <div className="px-4 pt-4 pb-6 space-y-3">
                        {navLinks.map((link) => (
                            <RouterNavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `block px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-[#E23C60] text-white shadow-lg shadow-[#E23C60]/30'
                                        : 'text-gray-300 hover:text-[#E23C60] hover:bg-white/10'
                                }`}
                            >
                                {link.name}
                            </RouterNavLink>
                        ))}
                        <div className="pt-4 border-t border-[#E23C60]/20">
                            <AuthButtons isMobile={true} />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
