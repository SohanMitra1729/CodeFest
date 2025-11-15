import React from 'react';
import { NavLink } from 'react-router-dom';
import Section from '../components/Section';
import { useAuth } from '../hooks/useAuth';
import { useContest } from '../hooks/useContest';
import { Team, RoundStatus } from '../types';

interface StatCardProps {
    label: string;
    value: string | number;
    valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, valueClassName }) => (
    <div className="bg-gradient-to-tr from-[#F589A0]/12 to-[#E23C60]/10 backdrop-blur-md border border-white/6 p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
        <p className={`mt-2 font-extrabold ${valueClassName || 'text-4xl text-accent'}`}>{value}</p>
    </div>
);

const TeamDashboardPage: React.FC = () => {
    const { user, teams } = useAuth();
    const { getTeamSubmission, submissions, getRoundById } = useContest();
    
    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;
    const submission = user?.teamId ? getTeamSubmission(user.teamId) : undefined;
    const round1 = getRoundById(1);
    const round2 = getRoundById(2);
    
    const leaderboardData = submissions
        .filter(s => typeof s.score === 'number')
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    let rank: number | string = '-';
    if (submission && typeof submission.score === 'number') {
        let currentRank = 0;
        let lastScore = -1;
        let rankDisplay = 0;
        for (const s of leaderboardData) {
            currentRank++;
            if (s.score !== lastScore) {
                rankDisplay = currentRank;
            }
            if (s.teamId === submission.teamId) {
                rank = rankDisplay;
                break;
            }
            lastScore = s.score ?? -1;
        }
    }

    const getStatusClass = (status?: RoundStatus): string => {
        const baseClass = 'text-3xl'; // Smaller font for text status
        switch (status) {
            case 'Active': return `text-green-400 ${baseClass}`;
            case 'Finished': return `text-gray-400 ${baseClass}`;
            case 'Not Started': return `text-yellow-400 ${baseClass}`;
            case 'Locked': return `text-gray-500 ${baseClass}`;
            default: return `text-gray-500 ${baseClass}`;
        }
    };

    if (!team) {
        return (
             <Section title="Team Dashboard">
                 <div className="max-w-md mx-auto text-center bg-gradient-to-tr from-[#F589A0]/10 to-[#E23C60]/8 backdrop-blur-md border border-white/6 p-8 rounded-lg shadow-lg">
                     <h3 className="text-2xl font-bold text-white">Let's Get You Started!</h3>
                     <p className="mt-4 text-dark-text">You haven't formed a team yet. Register your team to kickstart your Hackathon 2026 journey.</p>
                    <NavLink
                        to="/registration"
                        className="mt-8 inline-block admin-btn-gradient text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E23C60]/30"
                    >
                        Register Your Team
                    </NavLink>
                 </div>
             </Section>
        );
    }

    if (team.status === 'Pending') {
        return (
            <Section title="Registration Pending" subtitle="Thank you for registering!">
                <div className="max-w-md mx-auto text-center bg-gradient-to-tr from-[#F589A0]/10 to-[#E23C60]/8 backdrop-blur-md border border-white/6 p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-yellow-400">Your Team's Approval is Pending</h3>
                    <p className="mt-4 text-dark-text">Our team is currently reviewing your registration details and payment screenshot. You will be notified once your team is approved. Please check back later.</p>
                </div>
            </Section>
        );
    }

    if (team.status === 'Rejected') {
        return (
            <Section title="Registration Status" subtitle="There was an issue with your registration.">
                <div className="max-w-md mx-auto text-center bg-gradient-to-tr from-[#F589A0]/10 to-[#E23C60]/8 backdrop-blur-md border border-white/6 p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-red-400">Your Team Registration was Rejected</h3>
                    <p className="mt-4 text-dark-text">Unfortunately, there was an issue with your team's registration. Please contact the event coordinators for more details.</p>
                     <NavLink to="/contact" className="mt-8 inline-block text-gradient-to-r from-[#E23C60] to-[#F589A0] hover:underline text-white font-semibold">
                        Contact Organizers
                    </NavLink>
                </div>
            </Section>
        );
    }
    
    return (
        <div className="animate-fade-in-up">
            <Section title="Team Dashboard" subtitle={`Welcome, ${team.name}!`}>
                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Scores and Rank Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            label="Round 1 Status" 
                            value={round1?.status ?? 'Locked'} 
                            valueClassName={getStatusClass(round1?.status)}
                        />
                        <StatCard label="Round 1 Score" value={submission?.score ?? 'Pending'} />
                        <StatCard label="Current Rank" value={typeof rank === 'number' && rank > 0 ? `#${rank}` : '-'} />
                        <StatCard 
                            label="Round 2 Status" 
                            value={round2?.status ?? 'Locked'} 
                            valueClassName={getStatusClass(round2?.status)}
                        />
                    </div>

                    {/* Competition Actions Section */}
                    <div className="bg-gradient-to-tr from-[#F589A0]/12 to-[#E23C60]/10 backdrop-blur-md border border-white/6 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold admin-heading mb-6">Competition Actions</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                           {(() => {
                                const hasSubmitted = !!submission;
                                const isRound1Active = round1?.status === 'Active';
                                const isRound1Finished = round1?.status === 'Finished';

                                let buttonText = 'Go to Round 1 Contest';
                                let buttonClass = 'bg-gray-600 text-gray-300 cursor-not-allowed';
                                let isDisabled = true;

                                if (hasSubmitted) {
                                    buttonText = 'Round 1 Submitted';
                                } else if (isRound1Active) {
                                    buttonText = 'Start Round 1 Contest';
                                    buttonClass = 'bg-accent hover:bg-accent/80 text-white animate-pulse';
                                    isDisabled = false;
                                } else if (isRound1Finished) {
                                    buttonText = 'Round 1 Finished';
                                } else { // Not started or locked
                                    buttonText = 'Round 1 Not Started';
                                }

                                return (
                                    <NavLink 
                                        to="/contest/round1" 
                                        className={`flex-1 text-center font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 ${buttonClass}`}
                                        onClick={(e) => isDisabled && e.preventDefault()}
                                        aria-disabled={isDisabled}
                                    >
                                        {buttonText}
                                    </NavLink>
                                );
                            })()}
                                {(() => {
                                    // Compute Round 2 button appearance based on round2 status
                                    const isR2Active = round2?.status === 'Active';
                                    const isR2Finished = round2?.status === 'Finished';
                                    let r2Text = 'Go to Round 2 Submission';
                                    let r2Class = 'admin-btn-gradient';
                                    let r2Disabled = false;

                                    if (isR2Active) {
                                        r2Text = 'Start Round 2 Submission';
                                        r2Class = 'admin-btn-gradient';
                                        r2Disabled = false;
                                    } else if (isR2Finished) {
                                        r2Text = 'Round 2 Finished';
                                        r2Class = 'bg-gray-700 text-gray-300 cursor-not-allowed';
                                        r2Disabled = true;
                                    } else {
                                        // Not started / Locked
                                        r2Text = 'Round 2 Not Started';
                                        r2Class = 'bg-gray-600 text-gray-300 cursor-not-allowed';
                                        r2Disabled = true;
                                    }

                                    return (
                                        <NavLink to="/contest/round2" className={`flex-1 text-center ${r2Class} font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center`} onClick={(e) => r2Disabled && e.preventDefault()} aria-disabled={r2Disabled}>
                                            {r2Text}
                                        </NavLink>
                                    );
                                })()}
                        </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="bg-gradient-to-tr from-[#F589A0]/12 to-[#E23C60]/10 backdrop-blur-md border border-white/6 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold admin-heading mb-6">Team Members</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-[#E23C60]/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E23C60]/20">
                                    {team.members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-100">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full admin-badge`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default TeamDashboardPage;