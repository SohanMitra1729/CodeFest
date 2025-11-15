import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Section from '../components/Section';
import { useAuth } from '../hooks/useAuth';
import { TeamMember } from '../types';

const RegistrationPage: React.FC = () => {
    const { user, registerTeam } = useAuth();
    
    const [teamName, setTeamName] = useState('');
    const [college, setCollege] = useState('');
    const [members, setMembers] = useState<TeamMember[]>([
        { id: 1, name: '', email: '', role: 'Leader' },
        { id: 2, name: '', email: '', role: 'Member' },
    ]);
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [teamId, setTeamId] = useState('');

    useEffect(() => {
        if (user) {
            setMembers(prev => prev.map(m => m.role === 'Leader' ? { ...m, name: user.name, email: user.email } : m));
        }
    }, [user]);

    const handleAddMember = () => {
        if (members.length < 5) {
            setMembers([...members, { id: Date.now(), name: '', email: '', role: 'Member' }]);
        }
    };
    
    const handleRemoveMember = (id: number) => {
        if (members.length > 2) {
            setMembers(members.filter(member => member.id !== id));
        }
    };

    const handleMemberChange = (id: number, field: 'name' | 'email', value: string) => {
        setMembers(members.map(member => member.id === id ? { ...member, [field]: value } : member));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentScreenshot(e.target.files[0]);
        }
    };

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!paymentScreenshot) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(paymentScreenshot);
        setPreviewUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [paymentScreenshot]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        if (!paymentScreenshot) {
            setError('Please upload a payment screenshot.');
            setIsSubmitting(false);
            return;
        }

        try {
            const finalMembers = members.map((m, index) => ({ ...m, role: index === 0 ? 'Leader' as const : 'Member' as const }));
            const newTeamId = await registerTeam(teamName, college, finalMembers, paymentScreenshot);
            setTeamId(newTeamId);
            setIsSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            setError(err.message || 'Failed to register team.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user?.teamId && !isSubmitted) {
        return (
            <Section title="Registration Status" subtitle="You are all set!">
                <div className="max-w-md mx-auto text-center bg-secondary p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-white">Your team is already registered.</h3>
                    <p className="mt-4 text-dark-text">You can now view your team's status and prepare for the competition rounds.</p>
                    <NavLink to="/dashboard" className="mt-8 inline-block bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-full transition-colors">
                        Go to Dashboard
                    </NavLink>
                </div>
            </Section>
        );
    }

    if (isSubmitted) {
        return (
            <Section title="Registration Successful!" subtitle="Welcome to Hackathon 2026!">
                <div className="max-w-md mx-auto text-center bg-secondary p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-white">Your team has been registered.</h3>
                    <p className="mt-4 text-dark-text">Your Team ID is:</p>
                    <p className="text-3xl font-mono my-4 p-4 bg-primary rounded text-highlight">{teamId}</p>
                    <p className="text-dark-text">Please save this ID for future reference. The team leader will receive an email with further instructions.</p>
                </div>
            </Section>
        );
    }
    
    return (
        <div className="animate-fade-in-up">
            <Section title="Register Your Team" subtitle="Form a team and get ready to code!">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 bg-primary p-8 rounded-lg shadow-lg">
                    {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-center">{error}</p>}
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-dark-text mb-2">Team Name</label>
                        <input type="text" id="teamName" value={teamName} onChange={e => setTeamName(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                    </div>

                    <div>
                        <label htmlFor="college" className="block text-sm font-medium text-dark-text mb-2">College Name</label>
                        <input type="text" id="college" value={college} onChange={e => setCollege(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-medium text-white mb-4">Team Members ({members.length}/5)</h3>
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <div key={member.id} className="p-4 bg-primary rounded-md flex flex-col sm:flex-row gap-4 items-center">
                                    <span className="font-bold text-accent">{member.role}</span>
                                    <input type="text" placeholder="Full Name" value={member.name} onChange={e => handleMemberChange(member.id, 'name', e.target.value)} required readOnly={member.role === 'Leader'} className="flex-grow bg-secondary p-2 rounded-md border-transparent focus:ring-accent focus:border-accent w-full sm:w-auto disabled:opacity-70" />
                                    <input type="email" placeholder="Email Address" value={member.email} onChange={e => handleMemberChange(member.id, 'email', e.target.value)} required readOnly={member.role === 'Leader'} className="flex-grow bg-secondary p-2 rounded-md border-transparent focus:ring-accent focus:border-accent w-full sm:w-auto disabled:opacity-70" />
                                    {index > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveMember(member.id)} 
                                            className="text-red-500 hover:text-red-400 font-bold text-2xl w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary"
                                            aria-label={`Remove member ${index + 1}`}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {members.length < 5 && (
                             <button type="button" onClick={handleAddMember} className="mt-4 bg-accent/50 hover:bg-accent text-white font-bold py-2 px-4 rounded transition-colors">
                                + Add Member
                            </button>
                        )}
                    </div>
                    
                    <div className="p-4 bg-primary rounded-md">
                        <p className="text-sm text-dark-text text-center">Registration Fee: ₹500 per team.</p>
                        <p className="text-xs text-gray-400 text-center mb-4">Payment instructions will be emailed to the team leader upon registration.</p>
                        
                        <div>
                            <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-dark-text mb-2">
                                Payment Screenshot <span className="text-red-400">*</span>
                            </label>
                            <input 
                                type="file" 
                                id="paymentScreenshot" 
                                onChange={handleFileChange} 
                                required 
                                accept="image/*"
                                className="w-full text-sm text-dark-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/80 cursor-pointer"
                            />
                            {previewUrl && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-400 mb-2">Preview</p>
                                    <img src={previewUrl} alt="payment preview" className="mx-auto max-h-48 rounded-md shadow-md" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                         <button type="submit" className="bg-highlight hover:bg-highlight/80 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-highlight/30 disabled:opacity-50" disabled={isSubmitting || members.length < 2}>
                            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                        </button>
                    </div>
                </form>
            </Section>
        </div>
    );
};

export default RegistrationPage;
