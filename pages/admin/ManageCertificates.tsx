import React, { useState } from 'react';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';
import { CertificateType } from '../../types';

const ManageCertificates: React.FC = () => {
    const { submissions, certificates, awardCertificate } = useContest();
    const { teams } = useAuth();
    
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [selectedCertType, setSelectedCertType] = useState<CertificateType>('Participation');
    
    // Populate dropdown only with teams that have made a submission
    const eligibleTeams = teams.filter(team => submissions.some(sub => sub.teamId === team.id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeamId) {
            alert('Please select a team.');
            return;
        }
        const team = teams.find(t => t.id === selectedTeamId);
        if (team) {
            awardCertificate(selectedTeamId, team.name, selectedCertType);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-8">Manage Certificates</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="admin-surface p-8 rounded-xl">
                    <h3 className="text-xl font-semibold admin-heading mb-6">Award a New Certificate</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="team-select" className="block text-sm font-medium text-gray-300 mb-2">Select Team</label>
                            <select
                                id="team-select"
                                value={selectedTeamId}
                                onChange={e => setSelectedTeamId(e.target.value)}
                                className="w-full admin-input"
                            >
                                <option value="" disabled>-- Select a team --</option>
                                {eligibleTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="cert-type" className="block text-sm font-medium text-gray-300 mb-2">Certificate Type</label>
                            <select
                                id="cert-type"
                                value={selectedCertType}
                                onChange={e => setSelectedCertType(e.target.value as CertificateType)}
                                className="w-full admin-input"
                            >
                                <option>Participation</option>
                                <option>Appreciation</option>
                                <option>Outstanding Performance</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full admin-btn-gradient">
                            Award Certificate
                        </button>
                    </form>
                </div>
                <div className="admin-surface p-8 rounded-xl">
                    <h3 className="text-xl font-semibold admin-heading mb-6">Awarded Certificates ({certificates.length})</h3>
                     {certificates.length > 0 ? (
                        <ul className="space-y-3">
                            {certificates.map((cert, index) => (
                                <li key={index} className="admin-surface p-3 rounded-md flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-bold text-gray-100">{cert.teamName}</p>
                                        <p className="text-gray-300">{cert.awardedAt.toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-semibold px-3 py-1 rounded admin-badge">{cert.type}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-300 text-center mt-8">No certificates awarded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCertificates;