import React, { useState, useMemo } from 'react';
import Section from '../components/Section';
import { useContest } from '../hooks/useContest';
import { useAuth } from '../hooks/useAuth';

const LeaderboardPage: React.FC = () => {
    const [activeRound, setActiveRound] = useState('Round 1');
    const [collegeFilter, setCollegeFilter] = useState('');
    const { submissions } = useContest();
    const { teams } = useAuth();

    const colleges = useMemo(() => {
        return [...new Set(teams.map(team => team.college).filter(Boolean))].sort();
    }, [teams]);

    const leaderboardData = useMemo(() => {
        const scoredSubmissions = submissions.filter(s => typeof s.score === 'number');

        const enrichedSubmissions = scoredSubmissions.map(submission => {
            const team = teams.find(t => t.id === submission.teamId);
            return {
                ...submission,
                teamName: team?.name || 'Unknown Team',
                college: team?.college || 'Unknown College',
            };
        });

        const filteredSubmissions = collegeFilter
            ? enrichedSubmissions.filter(s => s.college === collegeFilter)
            : enrichedSubmissions;

        const sortedSubmissions = filteredSubmissions.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        return sortedSubmissions.map((submission, index) => ({
            ...submission,
            rank: index + 1,
        }));
    }, [submissions, teams, collegeFilter]);
    
    return (
        <div className="animate-fade-in-up bg-pro-gradient min-h-screen py-8">
            <Section title="Leaderboard" subtitle="Track the top performing teams in real-time.">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        {/* Round Filters */}
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full flex border border-[#E23C60]/50 hover:border-[#E23C60] transition">
                            <button onClick={() => setActiveRound('Round 1')} className={`px-6 py-2 rounded-full font-semibold transition-all ${activeRound === 'Round 1' ? 'bg-gradient-to-r from-[#E23C60] to-[#F589A0] text-white shadow-lg shadow-[#E23C60]/50' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
                                Round 1
                            </button>
                            <button disabled className="px-6 py-2 rounded-full font-semibold transition-colors text-white/30 cursor-not-allowed">
                                Round 2
                            </button>
                            <button disabled className="px-6 py-2 rounded-full font-semibold transition-colors text-white/30 cursor-not-allowed">
                                Final Results
                            </button>
                        </div>
                         {/* College Filter */}
                        <div className="relative">
                             <select
                                value={collegeFilter}
                                onChange={e => setCollegeFilter(e.target.value)}
                                className="bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full py-3 pl-6 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#E23C60] cursor-pointer border border-[#E23C60]/40 hover:border-[#E23C60] transition"
                                aria-label="Filter by college"
                            >
                                <option value="" className="bg-gray-900">All Colleges</option>
                                {colleges.map(college => (
                                    <option key={college} value={college} className="bg-gray-900">{college}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#E23C60]">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-[#E23C60]/30 hover:border-[#E23C60]/50 transition">
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-[#E23C60]/30 to-[#E23C60]/10 border-b border-[#E23C60]/40">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-[#E23C60] uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-[#E23C60] uppercase tracking-wider">Team Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-[#E23C60] uppercase tracking-wider">College</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-[#E23C60] uppercase tracking-wider">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E23C60]/10">
                                {leaderboardData.length > 0 ? leaderboardData.map((team, index) => (
                                    <tr key={team.teamId} className={`transition-all ${
                                        index < 3 
                                            ? 'bg-gradient-to-r from-[#E23C60]/15 to-transparent hover:from-[#E23C60]/25' 
                                            : 'hover:bg-[#E23C60]/10'
                                    }`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#E23C60]">
                                            {index < 3 ? ['🥇', '🥈', '🥉'][index] : team.rank}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">{team.teamName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#D9D9D9]">{team.college}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#E23C60] font-bold text-lg">{team.score}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-[#D9D9D9]">
                                            {collegeFilter ? `No teams from ${collegeFilter} have scores yet.` : 'No scores calculated yet. The leaderboard will update once the admin evaluates submissions.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default LeaderboardPage;