
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 border-t border-[#E23C60]/30">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-12">
                    <div className="space-y-6 xl:col-span-1">
                        <RouterNavLink to="/" className="text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text font-black text-2xl hover:scale-110 transition-transform inline-block">
                            HACKATHON '26
                        </RouterNavLink>
                        <p className="text-sm text-gray-400 font-medium">National Institute of Technology, Silchar</p>
                        <p className="text-sm text-gray-500 leading-relaxed">A national-level coding competition to foster innovation and problem-solving skills across the nation.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-black text-white tracking-widest uppercase border-b border-[#E23C60]/50 pb-3">Quick Links</h3>
                                <ul className="mt-6 space-y-3">
                                    <li><RouterNavLink to="/about" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">About</RouterNavLink></li>
                                    <li><RouterNavLink to="/rounds" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">Rounds</RouterNavLink></li>
                                    <li><RouterNavLink to="/prizes" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">Prizes</RouterNavLink></li>
                                    <li><RouterNavLink to="/leaderboard" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">Leaderboard</RouterNavLink></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-black text-white tracking-widest uppercase border-b border-[#E23C60]/50 pb-3">Support</h3>
                                <ul className="mt-6 space-y-3">
                                    <li><RouterNavLink to="/contact" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">Contact</RouterNavLink></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">FAQs</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                         <div className="md:grid md:grid-cols-1 md:gap-8">
                           <div>
                                <h3 className="text-sm font-black text-white tracking-widest uppercase border-b border-[#E23C60]/50 pb-3">Contact Us</h3>
                                <ul className="mt-6 space-y-3">
                                    <li><p className="text-base text-gray-300 font-medium">NIT Silchar, Cachar, Assam - 788010</p></li>
                                    <li><a href="mailto:hackathon@nits.ac.in" className="text-base text-gray-300 hover:text-[#E23C60] hover:translate-x-1 transition-all font-semibold">hackathon@nits.ac.in</a></li>
                                </ul>
                            </div>
                         </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-[#E23C60]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-base text-center md:text-left text-gray-500">&copy; 2024-2026 Hackathon Committee, NIT Silchar. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-[#E23C60] transition text-sm font-medium">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-[#E23C60] transition text-sm font-medium">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
