import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const loggedInUser = await auth.login(email, password);
            if (loggedInUser.role === UserRole.ADMIN) {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to log in');
        }
    };

    return (
        <div className="animate-fade-in-up min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12">
            <div className="max-w-md mx-auto bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-[#E23C60]/20">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-[#D9D9D9]/70">Access your dashboard</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md text-center border border-red-500/40">{error}</p>}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 text-white placeholder-gray-500 focus:border-[#E23C60] focus:ring-2 focus:ring-[#E23C60]/30 transition" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">Password</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 text-white placeholder-gray-500 focus:border-[#E23C60] focus:ring-2 focus:ring-[#E23C60]/30 transition" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-[#E23C60] to-[#C02D50] hover:from-[#C02D50] hover:to-[#A01F3D] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#E23C60]/30 hover:shadow-[#E23C60]/50">
                            Log In
                        </button>
                    </form>
                    <p className="text-center text-sm text-[#D9D9D9] mt-6">
                        Don't have an account? <NavLink to="/signup" className="font-semibold text-[#E23C60] hover:text-[#FF6B8A] transition">Sign Up</NavLink>
                    </p>
            </div>
        </div>
    );
};

export default LoginPage;