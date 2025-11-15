import React, { useState, useEffect } from 'react';
import { useContest } from '../../hooks/useContest';

const ManageRounds: React.FC = () => {
    const { rounds, startRound, endRound, setRoundDuration } = useContest();
    const round1 = rounds.find(r => r.id === 1);
    const [duration, setDuration] = useState(round1?.durationInMinutes || 90);

    useEffect(() => {
        setDuration(round1?.durationInMinutes || 90);
    }, [round1]);

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(Number(e.target.value));
    };

    const handleSetDuration = () => {
        setRoundDuration(1, duration);
        alert(`Round 1 duration set to ${duration} minutes.`);
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-8">Manage Rounds</h1>
            <div className="space-y-6">
                {rounds.map((round) => (
                    <div key={round.id} className="admin-surface p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold admin-heading">{round.name}</h3>
                                <p className={`mt-1 text-sm font-medium ${
                                    round.status === 'Active' ? 'admin-heading' :
                                    round.status === 'Finished' ? 'text-gray-400' :
                                    round.status === 'Not Started' ? 'admin-heading' : 'text-gray-500'
                                }`}>
                                    Status: {round.status}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => startRound(round.id)}
                                    className="admin-btn-gradient py-2 px-4 rounded transition-all duration-300 shadow-md disabled:opacity-50" 
                                    disabled={round.status === 'Active' || round.status === 'Finished' || round.status === 'Locked'}
                                >
                                    Start Round
                                </button>
                                <button 
                                    onClick={() => endRound(round.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" 
                                    disabled={round.status !== 'Active'}
                                >
                                    End Round
                                </button>
                            </div>
                        </div>
                        {round.id === 1 && round.status !== 'Active' && round.status !== 'Finished' && (
                            <div className="mt-4 pt-4 border-t border-white/6 flex items-center gap-4">
                                <label htmlFor="duration" className="text-sm font-medium text-gray-300">Set Duration (minutes):</label>
                                <input 
                                    type="number" 
                                    id="duration"
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="admin-input w-24"
                                />
                                <button onClick={handleSetDuration} className="admin-btn-gradient py-2 px-4 rounded transition-colors shadow-sm hover:shadow-lg">
                                    Set Duration
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageRounds;