import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
    const links = [
            { path: '/admin', name: 'Overview', exact: true },
            { path: '/admin/rounds', name: 'Manage Rounds' },
            { path: '/admin/teams', name: 'Manage Teams' },
            { path: '/admin/mcqs', name: 'Manage Round 1' },
            { path: '/admin/problems', name: 'Manage Round 2' },
            { path: '/admin/results', name: 'Manage Results' },
            { path: '/admin/certificates', name: 'Manage Certificates' },
    ];
    
    return (
        <aside className="w-64 bg-gradient-to-b from-[#05060a] via-[#071025] to-[#07101a] flex-shrink-0 p-6 border-r border-[#E23C60]/20 shadow-2xl backdrop-blur-md">
            {/* Logo Section */}
            <div className="mb-10 pb-6 border-b border-[#E23C60]/30">
                <RouterNavLink 
                    to="/" 
                    className="text-transparent bg-gradient-to-r from-[#F589A0] via-[#E23C60] to-[#F589A0] bg-clip-text font-extrabold text-3xl hover:scale-105 transition-transform inline-block"
                >
                    Code Fest
                </RouterNavLink>
                <p className="text-sm text-gray-300 mt-2 font-semibold tracking-wide">Admin Control Panel</p>
                <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[#E23C60] to-[#F589A0] opacity-90" />
            </div>

            {/* Navigation Links */}
            <nav className="space-y-3 mb-8">
                {links.map(link => (
                    <RouterNavLink
                        key={link.name}
                        to={link.path}
                        end={link.exact}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm
                            transition-all duration-300 group relative
                            ${isActive 
                                ? 'bg-gradient-to-r from-[#E23C60] to-[#F589A0] text-white shadow-lg shadow-[#E23C60]/50 border-l-4 border-white' 
                                : 'text-gray-300 hover:text-white hover:bg-[#E23C60]/8 backdrop-blur-sm border border-transparent hover:border-[#E23C60]/30'
                            }
                        `}
                    >
                            <span className="w-2 h-2 rounded-full bg-[#E23C60] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.name}</span>
                    </RouterNavLink>
                ))}
            </nav>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#E23C60]/30 to-transparent my-6"></div>

            {/* Stats/Info Section */}
                <div className="bg-white/5 backdrop-blur-md border border-[#E23C60]/20 rounded-xl p-4 mb-8">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">Quick Info</p>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Status</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-green-400 font-semibold">Active</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#E23C60]/20">
                <RouterNavLink 
                    to="/" 
                    className="flex items-center gap-2 text-sm text-gray-400 hover-admin-heading transition-colors group px-2 py-2 rounded-lg hover:bg-white/5"
                >
                    <span className="group-hover:scale-125 transition-transform">←</span>
                    <span>Back to Main Site</span>
                </RouterNavLink>
                <p className="text-xs text-gray-500 mt-4 px-2">© Hack Sphere 2026</p>
            </div>
        </aside>
    );
};

export default AdminSidebar;
