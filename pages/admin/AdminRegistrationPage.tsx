import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Section from '../../components/Section';

const AdminRegistrationPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            await auth.signupAdmin(name, email, password);
            navigate('/admin'); // Redirect to admin dashboard on success
        } catch (err: any) {
            setError(err.message || 'Failed to create admin account');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <Section title="Admin Registration" subtitle="Create the primary administrator account.">
                    <div className="max-w-md mx-auto admin-surface p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                         {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-center">{error}</p>}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">Full Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full admin-input" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">Email Address</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full admin-input" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">Password</label>
                                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full admin-input" />
                        </div>
                        <button type="submit" className="w-full admin-btn-gradient">
                            Create Admin Account
                        </button>
                    </form>
                </div>
            </Section>
        </div>
    );
};

export default AdminRegistrationPage;