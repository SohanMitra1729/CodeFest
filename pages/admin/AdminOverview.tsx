import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useContest } from '../../hooks/useContest';

const AdminOverview: React.FC = () => {
    const { teams } = useAuth();
    const { submissions, mcqs, codingProblems, certificates } = useContest();

    const stats = [
        { label: 'Total Registrations', value: `${teams.length} Teams` },
        { label: 'Round 1 Submissions', value: `${submissions.length} Teams` },
        { label: 'Active R1 Problems', value: mcqs.length + codingProblems.length },
        { label: 'Certificates Awarded', value: certificates.length },
    ];

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-8">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className="group admin-surface p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <h3 className="text-sm font-medium text-gray-300 transition-colors">{stat.label}</h3>
                        <p className="mt-2 text-3xl font-semibold admin-heading">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 admin-surface p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold admin-heading">Quick Actions</h2>
                <p className="text-gray-300 mt-2">Use the sidebar to manage rounds, add content, calculate results, and award certificates.</p>
            </div>
        </div>
    );
};

export default AdminOverview;