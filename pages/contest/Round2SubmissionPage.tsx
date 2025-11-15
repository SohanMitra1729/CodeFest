import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Section from '../../components/Section';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';

const Round2SubmissionPage: React.FC = () => {
    const [projectFile, setProjectFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { round2Problem, getRoundById } = useContest();
    const { user, teams } = useAuth();
    
    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;
    const round2 = getRoundById(2);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProjectFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectFile) {
            setIsSubmitted(true);
        }
    };
    
    if (team?.status !== 'Approved') {
        return (
           <Section title="Round 2: Project Submission">
               <div className="text-center bg-secondary p-8 rounded-lg max-w-md mx-auto">
                   <h3 className="text-2xl font-bold text-yellow-400">Team Not Approved</h3>
                   <p className="text-dark-text mt-2">Your team must be approved by an administrator before you can participate in this round.</p>
                   <NavLink to="/dashboard" className="mt-8 inline-block text-accent hover:underline">
                        &larr; Back to Dashboard
                    </NavLink>
               </div>
           </Section>
       );
   }
    
    if (round2?.status !== 'Active') {
        return (
           <Section title="Round 2: Project Submission">
               <div className="max-w-md mx-auto">
                   <div className="round2-surface p-8 rounded-lg">
                       <h3 className="text-2xl font-bold round2-heading">
                            {
                                round2?.status === 'Finished' ? 'Round 2 has ended.' :
                                round2?.status === 'Not Started' ? 'Round 2 has not started yet.' :
                                'Round 2 is currently locked.'
                            }
                       </h3>
                       <p className="text-gray-200 mt-3">
                           { round2?.status === 'Locked' ? 'This round will be unlocked after Round 1 is complete.' : 'Please wait for an announcement from the event organizers.'}
                       </p>
                       <div className="mt-6">
                           <NavLink to="/dashboard" className="inline-block admin-btn-gradient font-bold py-2 px-4 rounded-md transition-colors">
                               &larr; Back to Dashboard
                           </NavLink>
                       </div>
                   </div>
               </div>
           </Section>
       );
    }

    return (
        <div className="animate-fade-in-up">
            <Section title="Round 2: Project Submission">
                <div className="max-w-4xl mx-auto">
                          <div className="round2-surface p-8 rounded-lg shadow-lg mb-8">
                                <h3 className="text-2xl font-bold round2-heading mb-4">{round2Problem.title}</h3>
                                <p className="text-gray-200 space-y-4 whitespace-pre-wrap">
                                    {round2Problem.description}
                                </p>
                        {round2Problem.url && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-white mb-2">Reference Link:</h4>
                                <a 
                                    href={round2Problem.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block admin-btn-gradient font-bold py-2 px-4 rounded-md transition-colors break-all"
                                >
                                    {round2Problem.url}
                                </a>
                            </div>
                        )}
                    </div>

                    {isSubmitted ? (
                         <div className="text-center p-8 round2-surface rounded-md">
                            <h4 className="text-xl font-semibold text-green-400">Project Submitted Successfully!</h4>
                            <p className="text-gray-200 mt-2">Your submission for Round 2 has been received. Good luck!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="round2-surface p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold round2-heading mb-4">Submit Your Project</h3>
                            <p className="text-sm text-gray-200 mb-4">Please upload your entire project as a single compressed file (.zip recommended).</p>
                            <div>
                                <label htmlFor="projectFile" className="sr-only">Upload Project File</label>
                                <input 
                                    type="file" 
                                    id="projectFile" 
                                    onChange={handleFileChange} 
                                    required 
                                    accept=".zip,.rar,.7z"
                                    className="w-full text-sm text-dark-text reg-file file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold cursor-pointer" 
                                />
                            </div>
                            <div className="text-center mt-6">
                                <button type="submit" className="admin-btn-gradient text-lg rounded-full py-3 px-8 font-bold transition-transform transform hover:scale-105 disabled:opacity-50" disabled={!projectFile}>
                                    Submit Final Project
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default Round2SubmissionPage;