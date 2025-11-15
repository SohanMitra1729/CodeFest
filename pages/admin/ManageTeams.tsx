import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Team } from '../../types';
import { supabase } from '../../lib/supabaseClient';

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    const { approveTeam, rejectTeam } = useAuth();

    const ScreenshotPreview: React.FC<{ path: string }> = ({ path }) => {
        const [imageUrl, setImageUrl] = useState<string | null>(null);
        const [loading, setLoading] = useState(true);
        const [showModal, setShowModal] = useState(false);

        useEffect(() => {
            const loadImage = async () => {
                try {
                    // If path already looks like a full URL, use it directly
                    if (path.startsWith('http')) {
                        setImageUrl(path);
                        setLoading(false);
                        return;
                    }

                    // Otherwise treat it as storage path and ask Supabase for a signed URL
                    const res = await supabase.storage.from('payments').createSignedUrl(path, 60 * 60);
                    const signed = (res as any).data?.signedUrl || (res as any).data?.signedURL;
                    if (signed) {
                        setImageUrl(signed);
                    } else {
                        // fallback to public url
                        const pub = supabase.storage.from('payments').getPublicUrl(path) as any;
                        const pubUrl = pub?.data?.publicUrl;
                        if (pubUrl) setImageUrl(pubUrl);
                    }
                } catch (e) {
                    console.error('Failed to load screenshot', e);
                } finally {
                    setLoading(false);
                }
            };

            loadImage();
        }, [path]);

        if (loading) {
            return <div className="w-20 h-20 bg-gray-700 rounded animate-pulse" />;
        }

        if (!imageUrl) {
            return <p className="text-sm text-yellow-400">Failed to load</p>;
        }

        return (
            <>
                <img 
                    src={imageUrl} 
                    alt="Payment Screenshot" 
                    onClick={() => setShowModal(true)}
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity border border-gray-600"
                />
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                        <div className="relative max-w-2xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                            <img src={imageUrl} alt="Payment Screenshot" className="max-w-full max-h-[90vh] rounded-lg" />
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const getStatusClasses = (status: Team['status']) => {
        switch (status) {
            case 'Approved':
                return 'admin-badge';
            case 'Pending':
                return 'admin-badge';
            case 'Rejected':
                return 'bg-red-600/20 text-red-400';
        }
    };
    
    return (
        <details className="admin-surface rounded-lg shadow-lg overflow-hidden">
            <summary className="p-6 cursor-pointer flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.college}</p>
                </div>
                <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(team.status)}`}>
                        {team.status}
                    </span>
                    <span className="text-sm font-medium admin-heading">{team.members.length} Members</span>
                </div>
            </summary>
            <div className="p-6 border-t border-white/6 bg-transparent">
                <h4 className="font-semibold text-gray-800 mb-4">Team Members:</h4>
                <ul className="space-y-3">
                    {team.members.map(member => (
                                <li key={member.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-gray-800">{member.name}</p>
                                <p className="text-gray-500">{member.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${member.role === 'Leader' ? 'bg-gray-200 text-gray-700' : 'admin-badge'}`}>
                                {member.role}
                            </span>
                        </li>
                    ))}
                </ul>
                 <div className="mt-4 pt-4 border-t border-white/6 flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Payment Screenshot:</h4>
                        {team.paymentScreenshotUrl ? (
                            <ScreenshotPreview path={team.paymentScreenshotUrl} />
                        ) : (
                            <p className="text-sm text-yellow-400">Screenshot Not Provided</p>
                        )}
                    </div>
                    {team.status === 'Pending' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => approveTeam(team.id)}
                                className="admin-btn-gradient py-1 px-3 rounded text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Approve
                            </button>
                             <button
                                onClick={() => rejectTeam(team.id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </details>
    );
};

type FilterStatus = 'Pending' | 'Approved' | 'Rejected' | 'All';

const ManageTeams: React.FC = () => {
    const { teams } = useAuth();
    const [filter, setFilter] = useState<FilterStatus>('Pending');
    const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);

    useEffect(() => {
        setCurrentTeams(teams);
    }, [teams]);


    const filteredTeams = useMemo(() => {
        if (filter === 'All') {
            return currentTeams;
        }
        return currentTeams.filter(team => team.status === filter);
    }, [currentTeams, filter]);

    const getCount = (status: FilterStatus) => {
        if (status === 'All') return currentTeams.length;
        return currentTeams.filter(team => team.status === status).length;
    };

    const FilterButton: React.FC<{ status: FilterStatus }> = ({ status }) => (
        <button
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
                filter === status
                    ? 'admin-btn-gradient text-white'
                    : 'bg-white/70 text-gray-800 hover:bg-gray-100'
            }`}
        >
            {status} ({getCount(status)})
        </button>
    );

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-4">Manage Teams</h1>
            
                <div className="flex items-center gap-2 mb-8 p-2 rounded-full w-fit admin-surface">
                    <FilterButton status="Pending" />
                    <FilterButton status="Approved" />
                    <FilterButton status="Rejected" />
                    <FilterButton status="All" />
                </div>
            
            <h2 className="text-2xl font-semibold text-gray-200 mb-6">{filter} Teams ({filteredTeams.length})</h2>

            {filteredTeams.length > 0 ? (
                <div className="space-y-6">
                    {filteredTeams.map(team => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            ) : (
                <div className="text-center admin-surface p-8 rounded-xl">
                    <p className="text-gray-300">No teams found for the "{filter}" filter.</p>
                </div>
            )}
        </div>
    );
};

export default ManageTeams;
