import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';

const ManageResults: React.FC = () => {
    const { submissions, calculateRound1Score } = useContest();
    const { teams } = useAuth();

    const getTeamName = (teamId: string) => {
        return teams.find(t => t.id === teamId)?.name || teamId;
    }

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-8">Submissions & Results</h1>
            
            <div className="admin-surface text-gray-200 p-8 rounded-xl mb-8">
                <h3 className="text-xl font-semibold admin-heading">Results Automation</h3>
                <p className="mt-4 text-gray-300">
                   Use the table below to automatically calculate scores for Round 1 MCQ submissions. Coding problems must be evaluated manually. The calculated scores will automatically update the public leaderboard.
                </p>
            </div>
            
            <div className="admin-surface text-gray-200 p-8 rounded-xl">
                <h3 className="text-xl font-semibold admin-heading mb-4">Round 1 Submissions ({submissions.length})</h3>
                {submissions.length > 0 ? (
                    <div className="overflow-x-auto">
                                <table className="min-w-full border border-cyan-500/20 rounded-lg overflow-hidden">
                                    <thead className="bg-gradient-to-r from-cyan-500/10 to-cyan-400/5 border-b border-cyan-500/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Team Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Submitted At</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cyan-500/15">
                                {submissions.map(sub => (
                                    <tr key={sub.teamId} className="hover:bg-cyan-500/5 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{getTeamName(sub.teamId)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{sub.submittedAt.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold admin-heading">
                                            {typeof sub.score === 'number' ? sub.score : 'Not Calculated'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <button 
                                                onClick={() => calculateRound1Score(sub.teamId)}
                                                className="admin-btn-gradient text-sm py-1 px-3 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                                disabled={typeof sub.score === 'number'}
                                            >
                                                Calculate Score
                                            </button>
                                            <NavLink to={`/admin/submission/${sub.teamId}`} className="text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 hover:text-white font-bold py-1 px-3 rounded transition-colors border border-cyan-500/30">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No submissions yet.</p>
                )}
            </div>
        </div>
    );
};

export default ManageResults;
