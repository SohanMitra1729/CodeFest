
import React from 'react';
import Section from '../components/Section';

const AboutPage: React.FC = () => {
    return (
        <div className="animate-fade-in-up bg-pro-gradient min-h-screen py-8">
            {/* Hero Section */}
            <div className="text-center mb-16 px-6">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                    Where <span className="text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text">Innovation</span> Meets <span className="text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text">Excellence</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-semibold">
                    Hack Sphere 2026 is NIT Silchar's premier platform for visionary developers, designers, and problem-solvers. 
                    <span className="text-[#E23C60] font-bold"> Build solutions. Change futures. Make history.</span>
                </p>
            </div>

            <Section title="Our Mission" subtitle="Empowering the next generation of innovators.">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Mission Card 1 */}
                    <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-8 hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 cursor-pointer">
                        <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">💡</div>
                        <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-3">Innovation First</h3>
                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition">Pushing boundaries and creating groundbreaking solutions that solve real-world challenges. We believe in unleashing creativity and turning ideas into impact.</p>
                    </div>

                    {/* Mission Card 2 */}
                    <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-8 hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 cursor-pointer">
                        <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🤝</div>
                        <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-3">Collaboration</h3>
                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition">Bring together brilliant minds from across India. Foster teamwork, mentorship, and networking opportunities that last beyond the hackathon.</p>
                    </div>

                    {/* Mission Card 3 */}
                    <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-8 hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 cursor-pointer">
                        <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🚀</div>
                        <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-3">Acceleration</h3>
                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition">Launch your tech career with internship offers, mentorship from industry experts, and exclusive opportunities with leading companies.</p>
                    </div>
                </div>
            </Section>

            <Section title="Why Hack Sphere?" subtitle="The ultimate platform for builders and dreamers.">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Feature 1 */}
                    <div className="flex gap-6 group">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#E23C60] to-[#F589A0] group-hover:scale-125 transition-transform">
                                <span className="text-white text-xl font-bold">✓</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#E23C60] transition">3 Progressive Rounds</h4>
                            <p className="text-gray-300 group-hover:text-gray-200 transition">MCQ Quiz → Coding Challenge → Offline Hackathon. Experience the full spectrum of technical excellence.</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex gap-6 group">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#E23C60] to-[#F589A0] group-hover:scale-125 transition-transform">
                                <span className="text-white text-xl font-bold">✓</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#E23C60] transition">₹5,00,000+ Prizes</h4>
                            <p className="text-gray-300 group-hover:text-gray-200 transition">Compete for massive rewards, cloud credits, internships, and lifetime recognition on our platform.</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex gap-6 group">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#E23C60] to-[#F589A0] group-hover:scale-125 transition-transform">
                                <span className="text-white text-xl font-bold">✓</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#E23C60] transition">Industry Mentorship</h4>
                            <p className="text-gray-300 group-hover:text-gray-200 transition">Connect with experienced professionals, get real-time feedback, and learn from the best in the industry.</p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex gap-6 group">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#E23C60] to-[#F589A0] group-hover:scale-125 transition-transform">
                                <span className="text-white text-xl font-bold">✓</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#E23C60] transition">National Reach</h4>
                            <p className="text-gray-300 group-hover:text-gray-200 transition">Compete with 500+ talented participants from 100+ teams across India. Build your national network.</p>
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="About NIT Silchar" subtitle="India's premier engineering institute.">
                <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-[#E23C60]/40 hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 group">
                            <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-4">🏆 Heritage Since 1967</h3>
                            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition">
                                National Institute of Technology, Silchar is one of India's premier engineering institutes. Established in 1967 as a Regional Engineering College, it was elevated to NIT status in 2002 and declared an <span className="text-[#E23C60] font-bold">Institute of National Importance</span>.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-[#E23C60]/40 hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 group">
                            <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-4">🎯 Excellence & Innovation</h3>
                            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition">
                                Renowned for <span className="text-[#E23C60] font-bold">academic excellence, research contributions, and vibrant campus culture</span>. NIT Silchar provides a world-class environment for students to excel, innovate, and contribute to national technological advancement.
                            </p>
                        </div>
                    </div>

                    {/* Right - Stats Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-6 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                            <p className="text-4xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition mb-2">57+</p>
                            <p className="text-sm text-gray-300 font-semibold group-hover:text-white transition">Years Legacy</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-6 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                            <p className="text-4xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition mb-2">10K+</p>
                            <p className="text-sm text-gray-300 font-semibold group-hover:text-white transition">Alumni Network</p>
                        </div>

                        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-6 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                            <p className="text-4xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition mb-2">16</p>
                            <p className="text-sm text-gray-300 font-semibold group-hover:text-white transition">Departments</p>
                        </div>

                        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-6 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                            <p className="text-4xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition mb-2">95%</p>
                            <p className="text-sm text-gray-300 font-semibold group-hover:text-white transition">Placements</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Call to Action */}
            <div className="text-center mt-16 px-6">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl p-10 hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 group">
                    <h2 className="text-4xl font-black text-white mb-4 group-hover:text-[#E23C60] transition">Ready to Code Your Future?</h2>
                    <p className="text-gray-300 mb-8 text-lg group-hover:text-gray-200 transition">
                        Join 500+ brilliant developers, designers, and innovators. Compete, collaborate, and create solutions that matter. 
                        <span className="text-[#E23C60] font-bold"> Your journey starts here.</span>
                    </p>
                    <a href="/registration" className="inline-block bg-gradient-to-r from-[#E23C60] to-[#F589A0] hover:from-[#F589A0] hover:to-[#E23C60] text-white font-bold py-3 px-10 rounded-xl transition transform hover:scale-110 shadow-xl shadow-[#E23C60]/50 hover:shadow-[#E23C60]/80 duration-300">
                        Register Now 🚀
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
