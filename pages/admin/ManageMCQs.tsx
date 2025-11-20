import React, { useState } from 'react';
import { useContest } from '../../hooks/useContest';
import { MCQ, MCQOption } from '../../types';

const ManageMCQs: React.FC = () => {
    const { mcqs, codingProblems, addMcq, addCodingProblem } = useContest();
    
    // State for new MCQ form
    const [newMcqQuestion, setNewMcqQuestion] = useState('');
    const [newMcqOptions, setNewMcqOptions] = useState<MCQOption[]>([ {id: 'a', text: ''}, {id: 'b', text: ''} ]);
    const [correctAnswerId, setCorrectAnswerId] = useState('a');

    // State for new Coding Problem form
    const [newProblemTitle, setNewProblemTitle] = useState('');
    const [newProblemDesc, setNewProblemDesc] = useState('');

    const handleAddOption = () => {
        if(newMcqOptions.length < 4) {
            const nextChar = String.fromCharCode(97 + newMcqOptions.length); // a, b, c, d
            setNewMcqOptions([...newMcqOptions, { id: nextChar, text: '' }]);
        }
    };

    const handleOptionTextChange = (id: string, text: string) => {
        setNewMcqOptions(newMcqOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
    };

    const handleAddMcq = (e: React.FormEvent) => {
        e.preventDefault();
        const mcqToAdd: Omit<MCQ, 'id'> = {
            question: newMcqQuestion,
            options: newMcqOptions,
            correctAnswerId,
        };
        addMcq(mcqToAdd);
        setNewMcqQuestion('');
        setNewMcqOptions([{id: 'a', text: ''}, {id: 'b', text: ''}]);
        setCorrectAnswerId('a');
    };
    
    const handleAddCodingProblem = (e: React.FormEvent) => {
        e.preventDefault();
        addCodingProblem({ title: newProblemTitle, description: newProblemDesc });
        setNewProblemTitle('');
        setNewProblemDesc('');
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold admin-heading mb-8">Manage Round 1 Content</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* MCQ Management */}
                <div className="space-y-8">
                    <div className="admin-surface p-6 rounded-xl">
                        <h3 className="text-xl font-semibold admin-heading mb-4">Add New MCQ</h3>
                        <form onSubmit={handleAddMcq} className="space-y-5">
                            <textarea value={newMcqQuestion} onChange={e => setNewMcqQuestion(e.target.value)} placeholder="Question Text" required className="w-full admin-input min-h-32 text-lg" />
                            {newMcqOptions.map((opt, index) => (
                                <div key={opt.id} className="flex items-center gap-3">
                                    <input type="radio" name="correctAnswer" value={opt.id} checked={correctAnswerId === opt.id} onChange={(e) => setCorrectAnswerId(e.target.value)} className="accent-[#06B6D4] w-5 h-5 cursor-pointer" />
                                    <input type="text" value={opt.text} onChange={e => handleOptionTextChange(opt.id, e.target.value)} placeholder={`Option ${opt.id.toUpperCase()}`} required className="flex-grow admin-input text-base py-3" />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddOption} disabled={newMcqOptions.length >= 4} className="text-sm admin-heading disabled:opacity-50">+ Add Option</button>
                             <button type="submit" className="w-full admin-btn-gradient py-3 text-lg font-semibold">Add MCQ</button>
                        </form>
                    </div>
                            <div className="admin-surface p-6 rounded-xl">
                                <h3 className="text-xl font-semibold admin-heading mb-4">Existing MCQs ({mcqs.length})</h3>
                        <ul className="space-y-2 text-sm">
                            {mcqs.map(mcq => <li key={mcq.id} className="p-3 bg-white text-gray-800 rounded border border-gray-200 hover:border-cyan-400 hover:shadow-sm transition-all">{mcq.question}</li>)}
                        </ul>
                    </div>
                </div>

                {/* Coding Problem Management */}
                <div className="space-y-8">
                    <div className="admin-surface p-6 rounded-xl">
                        <h3 className="text-xl font-semibold admin-heading mb-4">Add New Coding Problem</h3>
                        <form onSubmit={handleAddCodingProblem} className="space-y-5">
                             <input type="text" value={newProblemTitle} onChange={e => setNewProblemTitle(e.target.value)} placeholder="Problem Title" required className="w-full admin-input text-base py-3 text-lg" />
                            <textarea value={newProblemDesc} onChange={e => setNewProblemDesc(e.target.value)} placeholder="Problem Description" required rows={6} className="w-full admin-input text-base min-h-40 text-lg" />
                            <button type="submit" className="w-full admin-btn-gradient py-3 text-lg font-semibold">Add Coding Problem</button>
                        </form>
                    </div>
                    <div className="admin-surface p-6 rounded-xl">
                        <h3 className="text-xl font-semibold admin-heading mb-4">Existing Coding Problems ({codingProblems.length})</h3>
                        <ul className="space-y-2 text-sm">
                            {codingProblems.map(p => <li key={p.id} className="p-3 bg-white text-gray-800 rounded border border-gray-200 hover:border-cyan-400 hover:shadow-sm transition-all">{p.title}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMCQs;
