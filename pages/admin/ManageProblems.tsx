import React, { useState } from 'react';
import { useContest } from '../../hooks/useContest';

const ManageProblems: React.FC = () => {
    const { round2Problem, updateRound2Problem } = useContest();
    const [title, setTitle] = useState(round2Problem.title);
    const [description, setDescription] = useState(round2Problem.description);
    const [url, setUrl] = useState(round2Problem.url || '');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateRound2Problem({ title, description, url });
        setSuccessMessage('Round 2 problem statement has been updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-8">Manage Round 2 Problem</h1>
            <div className="admin-surface p-8 rounded-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="problemTitle" className="block text-sm font-medium text-gray-300 mb-2">Problem Title</label>
                        <input
                            type="text"
                            id="problemTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full admin-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="problemDescription" className="block text-sm font-medium text-dark-text mb-2">Problem Description</label>
                        <textarea
                            id="problemDescription"
                            rows={10}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full admin-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="problemUrl" className="block text-sm font-medium text-dark-text mb-2">Reference URL (Optional)</label>
                        <input
                            type="url"
                            id="problemUrl"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/api/docs"
                            className="w-full admin-input"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="admin-btn-gradient py-2 px-6 rounded-md transition-colors shadow-sm hover:shadow-lg">
                            Save & Publish
                        </button>
                        {successMessage && <p className="admin-heading text-sm">{successMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageProblems;