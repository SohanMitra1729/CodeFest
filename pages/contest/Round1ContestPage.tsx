import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';
import { MCQ, CodingProblem } from '../../types';
import { executeCode } from '../../lib/codeExecutor';

type Question = (MCQ & { type: 'mcq' }) | (CodingProblem & { type: 'coding' });

const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const Round1ContestPage: React.FC = () => {
    const { mcqs, codingProblems, getRoundById, submitRound1, getTeamSubmission } = useContest();
    const { user, teams } = useAuth();
    
    const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: string }>({});
    const [codingAnswers, setCodingAnswers] = useState<{ [key: string]: { code: string; language: string; submissionResult?: { passed: number; total: number } } }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [runResults, setRunResults] = useState<{ [problemId: string]: { message: string; results: any[] } }>({});
    const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({});

    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;
    const round1 = getRoundById(1);
    const existingSubmission = user?.teamId ? getTeamSubmission(user.teamId) : undefined;
    
    const allQuestions: Question[] = useMemo(() => [
        ...mcqs.map(q => ({ ...q, type: 'mcq' as const })),
        ...codingProblems.map(p => ({ ...p, type: 'coding' as const })),
    ], [mcqs, codingProblems]);
    
    const handleSubmit = useCallback(async () => {
        if (user && user.teamId && !existingSubmission && !isSubmitted) {
            try {
                await submitRound1({ teamId: user.teamId, mcqAnswers, codingAnswers });
                setIsSubmitted(true);
                localStorage.removeItem(`round1_startTime_${user.teamId}`);
            } catch (error) {
                console.error("Failed to submit:", error);
                alert("There was an error submitting your test. Please check your connection and try again. If the problem persists, contact an organizer.");
            }
        }
    }, [user, existingSubmission, isSubmitted, mcqAnswers, codingAnswers, submitRound1]);

    useEffect(() => {
        if (round1?.status === 'Active' && user?.teamId && !existingSubmission && !isSubmitted) {
            const startTimeKey = `round1_startTime_${user.teamId}`;
            const storedStartTime = localStorage.getItem(startTimeKey);
            const contestDuration = (round1.durationInMinutes || 0) * 60;

            let startTime: number;
            if (storedStartTime) {
                startTime = parseInt(storedStartTime, 10);
            } else {
                startTime = Date.now();
                localStorage.setItem(startTimeKey, startTime.toString());
            }

            const updateTimer = () => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remaining = contestDuration - elapsed;
                setTimeLeft(remaining);

                if (remaining <= 0) {
                    handleSubmit();
                }
            };
            
            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [round1, user, handleSubmit, existingSubmission, isSubmitted]);

    const handleRunCode = async (problem: CodingProblem) => {
        const problemState = codingAnswers[problem.id];
        const userCode = problemState?.code || '';
        const language = problemState?.language || 'javascript';
        if (!userCode.trim()) return;

        setIsProcessing(prev => ({ ...prev, [`run-${problem.id}`]: true }));
        setRunResults(prev => ({ ...prev, [problem.id]: { message: 'Running test cases...', results: [] } }));

        const resultsPromises = problem.displayedTestCases.map(tc => 
            executeCode(userCode, language, tc.input)
        );
        const executionResults = await Promise.all(resultsPromises);

        const results = problem.displayedTestCases.map((tc, index) => {
            const execution = executionResults[index];
            const passed = !execution.error && execution.output === tc.expectedOutput;
            return {
                input: tc.input,
                output: execution.error ? `Error: ${execution.error}` : execution.output,
                expected: tc.expectedOutput,
                passed,
            };
        });
        
        setRunResults(prev => ({ ...prev, [problem.id]: { message: 'Run complete.', results } }));
        setIsProcessing(prev => ({ ...prev, [`run-${problem.id}`]: false }));
    };

    const handleSubmitCode = async (problem: CodingProblem) => {
        const problemState = codingAnswers[problem.id];
        const userCode = problemState?.code || '';
        const language = problemState?.language || 'javascript';
        if (!userCode.trim()) {
             alert('Please write some code before submitting.');
             return;
        };

        setIsProcessing(prev => ({ ...prev, [`submit-${problem.id}`]: true }));
        setRunResults(prev => ({ ...prev, [problem.id]: { message: 'Submitting and evaluating on hidden test cases...', results: [] } }));

        const resultsPromises = problem.hiddenTestCases.map(tc => 
            executeCode(userCode, language, tc.input)
        );
        const executionResults = await Promise.all(resultsPromises);
        
        let passedCount = 0;
        problem.hiddenTestCases.forEach((tc, index) => {
             const execution = executionResults[index];
             if (!execution.error && execution.output === tc.expectedOutput) {
                passedCount++;
            }
        });
        
        setCodingAnswers(prev => ({
            ...prev,
            [problem.id]: {
                ...prev[problem.id],
                code: userCode,
                language,
                submissionResult: { passed: passedCount, total: problem.hiddenTestCases.length },
            }
        }));

        setRunResults(prev => ({ ...prev, [problem.id]: { message: '', results: [] } }));
        setIsProcessing(prev => ({ ...prev, [`submit-${problem.id}`]: false }));
    };


    if (team?.status !== 'Approved') {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center animate-fade-in-up">
                <div className="text-center bg-secondary p-8 rounded-lg max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-yellow-400">
                        Team Not Approved
                    </h3>
                    <p className="text-dark-text mt-2">Your team must be approved by an administrator before you can participate in the contest rounds.</p>
                    <NavLink to="/dashboard" className="mt-8 inline-block text-accent hover:underline">
                        &larr; Back to Dashboard
                    </NavLink>
                </div>
            </div>
        );
    }

    if (existingSubmission || isSubmitted) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center animate-fade-in-up">
                <div className="text-center bg-secondary p-8 rounded-lg max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-green-400">Submission Received</h3>
                    <p className="text-dark-text mt-2">Your team's submission for Round 1 has been recorded.</p>
                </div>
            </div>
        );
    }
    
    if (round1?.status !== 'Active') {
         return (
             <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center animate-fade-in-up">
                <div className="text-center bg-secondary p-8 rounded-lg max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-yellow-400">
                        {
                            round1?.status === 'Finished' ? 'Round 1 has ended.' :
                            round1?.status === 'Not Started' ? 'Round 1 has not started yet.' :
                            'Round 1 is currently locked.'
                        }
                    </h3>
                    <p className="text-dark-text mt-2">Please wait for an announcement from the event organizers.</p>
                </div>
            </div>
        );
    }
    
    const handleMcqChange = (questionId: string, optionId: string) => {
        setMcqAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleCodingChange = (problemId: string, code: string) => {
        setCodingAnswers(prev => ({ ...prev, [problemId]: { ...(prev[problemId] || { language: 'javascript' }), code } }));
    };
    
    const handleLanguageChange = (problemId: string, language: string) => {
         setCodingAnswers(prev => ({ ...prev, [problemId]: { code: prev[problemId]?.code || '', language } }));
    };

    const isQuestionAnswered = (question: Question): boolean => {
        if (question.type === 'mcq') {
            return !!mcqAnswers[question.id];
        } else {
            return !!codingAnswers[question.id]?.submissionResult;
        }
    };
    
    const renderQuestion = (question: Question, index: number) => {
        const questionNumber = index + 1;
        if (question.type === 'mcq') {
            return (
                <div key={question.id} id={`q-${index}`} className="bg-secondary p-6 rounded-lg mb-8">
                    <p className="font-semibold text-dark-text">{`${questionNumber}. ${question.question}`}</p>
                    <div className="flex flex-col space-y-2 mt-4 text-sm">
                        {question.options.map(opt => (
                            <label key={opt.id} className="flex items-center p-2 rounded hover:bg-primary/50 cursor-pointer">
                                <input type="radio" name={question.id} value={opt.id} onChange={() => handleMcqChange(question.id, opt.id)} checked={mcqAnswers[question.id] === opt.id} className="mr-3" />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                </div>
            );
        } else { // 'coding'
            const problemRunResult = runResults[question.id];
            const problemSubmissionResult = codingAnswers[question.id]?.submissionResult;

             return (
                <div key={question.id} id={`q-${index}`} className="bg-secondary p-6 rounded-lg mb-8">
                     <div className="bg-primary p-4 rounded-md mb-4">
                        <h4 className="font-semibold text-accent">{`${questionNumber}. ${question.title}`}</h4>
                        <p className="text-sm text-dark-text mt-2 whitespace-pre-wrap">{question.description}</p>
                    </div>
                    <div className="mb-4">
                        <select 
                            value={codingAnswers[question.id]?.language || 'javascript'} 
                            onChange={(e) => handleLanguageChange(question.id, e.target.value)}
                            className="bg-primary p-2 rounded-md text-sm"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                    <textarea 
                        className="w-full h-80 bg-primary p-4 rounded-md border border-secondary focus:ring-accent focus:border-accent font-mono text-sm"
                        placeholder="Write your code here..."
                        value={codingAnswers[question.id]?.code || ''}
                        onChange={(e) => handleCodingChange(question.id, e.target.value)}
                    />
                    <div className="flex items-center gap-4 mt-4">
                        <button onClick={() => handleRunCode(question)} className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" disabled={isProcessing[`run-${question.id}`] || isProcessing[`submit-${question.id}`]}>
                            {isProcessing[`run-${question.id}`] && <LoadingSpinner />} Run Code
                        </button>
                        <button onClick={() => handleSubmitCode(question)} className="flex items-center justify-center bg-gradient-to-r from-[#E23C60] to-[#F589A0] hover:from-[#F589A0] hover:to-[#E23C60] text-white font-bold py-2 px-4 rounded transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50" disabled={isProcessing[`submit-${question.id}`] || isProcessing[`run-${question.id}`]}>
                            {isProcessing[`submit-${question.id}`] && <LoadingSpinner />} Submit
                        </button>
                    </div>
                    
                    {problemSubmissionResult && (
                         <div className="mt-4 p-4 bg-primary rounded-md">
                             <h4 className="font-semibold text-white">Submission Result</h4>
                             <p className="mt-2 text-lg">
                                 Test Cases Passed: 
                                 <span className="font-bold text-highlight ml-2">{problemSubmissionResult.passed} / {problemSubmissionResult.total}</span>
                             </p>
                         </div>
                    )}

                    {problemRunResult && (
                        <div className="mt-4 p-4 bg-primary rounded-md">
                            <h4 className="font-semibold text-white">{problemRunResult.message}</h4>
                            {problemRunResult.results.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {problemRunResult.results.map((res, i) => (
                                        <div key={i} className={`p-2 rounded text-xs ${res.passed ? 'bg-[#E23C60]/20' : 'bg-red-600/20'}`}>
                                            <p className="font-bold">Test Case {i+1}: {res.passed ? 'Passed' : 'Failed'}</p>
                                            <p><span className="font-semibold">Input:</span> <code className="font-mono">{res.input}</code></p>
                                            <p><span className="font-semibold">Your Output:</span> <code className="font-mono">{res.output ?? 'null'}</code></p>
                                            {!res.passed && <p><span className="font-semibold">Expected:</span> <code className="font-mono">{res.expected}</code></p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-grow w-full md:w-2/3">
                 <h1 className="text-3xl font-bold text-white mb-4">Round 1: Online Challenge</h1>
                 {viewAll ? (
                    allQuestions.map(renderQuestion)
                 ) : (
                    allQuestions.length > 0 ? renderQuestion(allQuestions[currentQuestionIndex], currentQuestionIndex) : <p>Loading questions...</p>
                 )}
                 {!viewAll && allQuestions.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => setCurrentQuestionIndex(p => p - 1)} disabled={currentQuestionIndex === 0} className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-6 rounded disabled:opacity-50">Previous</button>
                        <button onClick={() => setCurrentQuestionIndex(p => p + 1)} disabled={currentQuestionIndex === allQuestions.length - 1} className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-6 rounded disabled:opacity-50">Next</button>
                    </div>
                 )}
            </div>
            {/* Side Panel */}
            <aside className="w-full md:w-1/3 lg:w-1/4 space-y-6 md:sticky top-20 h-fit">
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-white">Time Remaining</h3>
                    <p className="text-3xl font-mono font-bold text-highlight mt-2">{timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}</p>
                </div>
                 <div className="bg-secondary p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Questions</h3>
                         <button onClick={() => setViewAll(v => !v)} className="text-xs bg-primary hover:bg-accent/50 p-2 rounded">{viewAll ? 'Single View' : 'View All'}</button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {allQuestions.map((q, index) => (
                            <a key={q.id} href={viewAll ? `#q-${index}` : undefined} onClick={() => !viewAll && setCurrentQuestionIndex(index)}
                                className={`flex items-center justify-center h-10 w-10 rounded font-bold text-sm cursor-pointer transition-colors ${
                                    index === currentQuestionIndex && !viewAll ? 'bg-accent text-white ring-2 ring-white' :
                                    isQuestionAnswered(q) ? 'bg-gradient-to-r from-[#E23C60] to-[#F589A0] hover:from-[#F589A0] hover:to-[#E23C60]' :
                                    'bg-primary hover:bg-secondary/50'
                                }`}
                            >
                                {index + 1}
                            </a>
                        ))}
                    </div>
                </div>
                <button onClick={() => window.confirm('Are you sure you want to finish and submit the test?') && handleSubmit()} className="w-full bg-highlight hover:bg-highlight/80 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Finish & Submit Test
                </button>
            </aside>
        </div>
    );
};

export default Round1ContestPage;
