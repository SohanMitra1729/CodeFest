import React, { useState } from 'react';
import Section from '../components/Section';

interface TeamMember {
    name: string;
    phone: string;
    branch: string;
    year: string;
}

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const teamMembers: TeamMember[] = [
        { name: 'Rajesh', phone: '+91 98765 43210', branch: 'CSE', year: '3rd' },
        { name: 'Hemanth', phone: '+91 98765 43211', branch: 'CSE', year: '3rd' },
        { name: 'Karthik', phone: '+91 98765 43212', branch: 'CSE', year: '3rd' },
        { name: 'Vasanth', phone: '+91 98765 43213', branch: 'CSE', year: '3rd' },
        { name: 'Madan', phone: '+91 98765 43214', branch: 'CSE', year: '3rd' },
        { name: 'Tanishq', phone: '+91 98765 43215', branch: 'CSE', year: '3rd' },
        { name: 'Abhiram', phone: '+91 98765 43216', branch: 'CSE', year: '3rd' },
        { name: 'Arun', phone: '+91 98765 43217', branch: 'CSE', year: '3rd' },
        { name: 'Harsha', phone: '+91 98765 43218', branch: 'CSE', year: '3rd' },
    ];

    return (
        <div className="animate-fade-in-up bg-pro-gradient min-h-screen py-8">
            {/* Contact Form Section - FIRST */}
            <Section title="Get In Touch" subtitle="Have questions? We'd love to hear from you.">
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16">

                    <div className="bg-white/10 backdrop-blur-md border border-[#E23C60]/30 p-8 rounded-xl shadow-2xl hover:border-[#E23C60]/50 transition">
                        <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-6">Send us a Message</h3>

                        {submitted ? (
                            <div className="text-center p-8 bg-gradient-to-br from-[#E23C60]/20 to-[#F589A0]/10 rounded-lg border border-[#E23C60]/30 backdrop-blur-sm">
                                <h4 className="text-xl font-semibold text-[#E23C60]">Thank You!</h4>
                                <p className="text-gray-300 mt-2">Your message has been sent. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form
                                action="https://api.web3forms.com/submit?"
                                method="POST"
                                className="space-y-6"
                            onSubmit={() => {
    setTimeout(() => setSubmitted(true), 500); 
}}

                            >
                                <input
  type="hidden"
  name="access_key"
  value="71b8679b-c6a1-46fd-be34-058efd3a3732"
/>

                                <input type="hidden" name="subject" value="New Contact Message" />

                                <div>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        className="w-full bg-gray-800/50 text-white p-3 rounded-lg border border-[#E23C60]/30 focus:border-[#E23C60] focus:ring-2 focus:ring-[#E23C60]/50 placeholder-gray-500 transition"
                                    />
                                </div>

                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                        className="w-full bg-gray-800/50 text-white p-3 rounded-lg border border-[#E23C60]/30 focus:border-[#E23C60] focus:ring-2 focus:ring-[#E23C60]/50 placeholder-gray-500 transition"
                                    />
                                </div>

                                <div>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        placeholder="Your Message"
                                        required
                                        className="w-full bg-gray-800/50 text-white p-3 rounded-lg border border-[#E23C60]/30 focus:border-[#E23C60] focus:ring-2 focus:ring-[#E23C60]/50 placeholder-gray-500 transition resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#E23C60] to-[#F589A0] hover:from-[#F589A0] hover:to-[#E23C60] text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-[#E23C60]/40 duration-300"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="text-gray-200 space-y-8">
                        <div className="bg-white/10 backdrop-blur-sm border border-[#E23C60]/30 p-6 rounded-xl hover:border-[#E23C60]/50 transition">
                            <h3 className="text-xl font-semibold text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text">Contact Information</h3>
                            <p className="mt-3 text-gray-300">NIT Silchar, Cachar, Assam - 788010</p>
                            <p className="text-gray-300 mt-2">Email: <a href="mailto:hackathon@nits.ac.in" className="text-[#E23C60] hover:text-[#F589A0] hover:underline transition">hackathon@nits.ac.in</a></p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm border border-[#E23C60]/30 p-6 rounded-xl hover:border-[#E23C60]/50 transition">
                            <h3 className="text-xl font-semibold text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text">General Contact</h3>
                            <p className="mt-3 text-gray-300 font-semibold">Hackathon Team: <span className="text-[#E23C60]">+91 98765 43200</span></p>
                            <p className="text-gray-300 font-semibold mt-2">For queries: <span className="text-[#E23C60]">+91 98765 43201</span></p>
                        </div>

                    </div>

                </div>
            </Section>

            {/* Team Members Section - SECOND */}
            <Section title="Team Coordinators" subtitle="Meet the dedicated team behind Hackathon 2026">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-[#E23C60]/30 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-[#E23C60]/40 transition-all duration-300 transform hover:scale-105 hover:border-[#E23C60]/60 hover:from-white/15 hover:to-white/8 cursor-pointer"
                        >
                            {/* Gradient accent on hover */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#E23C60]/0 via-[#E23C60]/0 to-[#E23C60]/0 group-hover:from-[#E23C60]/10 group-hover:via-transparent group-hover:to-[#F589A0]/10 transition-all duration-300 pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Header with avatar placeholder */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E23C60] to-[#F589A0] flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:shadow-[#E23C60]/50 transition-shadow">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#E23C60] transition-colors">{member.name}</h3>
                                        <p className="text-sm text-gray-400">{member.branch} - {member.year}rd Year</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-[#E23C60]/20 via-[#E23C60]/40 to-[#E23C60]/20 mb-4 group-hover:from-[#E23C60]/40 group-hover:to-[#E23C60]/40 transition-all"></div>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#E23C60] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="text-gray-300 group-hover:text-white transition-colors font-semibold">{member.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#E23C60] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-gray-300 group-hover:text-white transition-colors font-semibold">{member.branch}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#E23C60] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m0 0L5.382 15.766m6.618 0l6.618 1.981M12 6.253L18.618 8.734" />
                                        </svg>
                                        <span className="text-gray-300 group-hover:text-white transition-colors font-semibold">{member.year}rd Year</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E23C60] to-transparent opacity-0 group-hover:opacity-100 rounded-b-xl transition-opacity duration-300"></div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default ContactPage;
