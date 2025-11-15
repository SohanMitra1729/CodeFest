import React, { createContext, useState, ReactNode } from 'react';
import { Round, MCQ, CodingProblem, Round1Submission, ContestContextType, Round2Problem, Certificate, CertificateType } from '../types';
import { mockRounds, mockMCQs, mockCodingProblems, mockSubmissions, mockRound2Problem, mockCertificates } from '../data/mockData';

export const ContestContext = createContext<ContestContextType | undefined>(undefined);

const POINTS_PER_MCQ = 10;

interface ContestProviderProps {
  children: ReactNode;
}

export const ContestProvider: React.FC<ContestProviderProps> = ({ children }) => {
    const [rounds, setRounds] = useState<Round[]>(mockRounds);
    const [mcqs, setMcqs] = useState<MCQ[]>(mockMCQs);
    const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(mockCodingProblems);
    const [submissions, setSubmissions] = useState<Round1Submission[]>(mockSubmissions);
    const [round2Problem, setRound2Problem] = useState<Round2Problem>(mockRound2Problem);
    const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);

   const startRound = (roundId: number) => {
    setRounds(prev =>
        prev.map(r =>
            r.id === roundId
                ? {
                    ...r,
                    status: 'Active',
                    startedAt: new Date().toISOString()  
                }
                : r
        )
    );
};


    const endRound = (roundId: number) => {
        setRounds(prev => prev.map(r => r.id === roundId ? { ...r, status: 'Finished' } : r));
        if (roundId === 1) { // Unlock round 2
            setRounds(prev => prev.map(r => r.id === 2 ? { ...r, status: 'Not Started' } : r));
        }
    };
    
    const setRoundDuration = (roundId: number, duration: number) => {
        setRounds(prev => prev.map(r => r.id === roundId ? { ...r, durationInMinutes: duration } : r));
    };

    const addMcq = (mcq: Omit<MCQ, 'id'>) => {
        const newMcq = { ...mcq, id: `mcq-${Date.now()}` };
        setMcqs(prev => [...prev, newMcq]);
    };

    const addCodingProblem = (problem: Omit<CodingProblem, 'id' | 'displayedTestCases' | 'hiddenTestCases'>) => {
       const newProblem: CodingProblem = { 
           ...problem, 
           id: `cp-${Date.now()}`,
           displayedTestCases: [], 
           hiddenTestCases: [] 
        };
       setCodingProblems(prev => [...prev, newProblem]);
    };

    const submitRound1 = (submission: Omit<Round1Submission, 'submittedAt'|'score'>) => {
        const newSubmission: Round1Submission = { ...submission, submittedAt: new Date() };
        setSubmissions(prev => {
            const existingIndex = prev.findIndex(s => s.teamId === submission.teamId);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = newSubmission;
                return updated;
            }
            return [...prev, newSubmission];
        });
    };
    
    const updateRound2Problem = (problem: Round2Problem) => {
        setRound2Problem(problem);
    };
    
    const calculateRound1Score = (teamId: string) => {
    const submission = submissions.find(s => s.teamId === teamId);
    if (!submission) return;

    let score = 0;
    let wrongAnswers = 0;

    /** -------------------------
     *   MCQ SCORING
     *  ------------------------*/
    const mcqEntries = Object.entries(submission.mcqAnswers);
    const mcqsToScore = mcqEntries.slice(0, 5); // 5 MCQs total

    mcqsToScore.forEach(([mcqId, answerId]) => {
        const mcq = mcqs.find(q => q.id === mcqId);
        if (!mcq) return;

        if (mcq.correctAnswerId === answerId) {
            score += 4; // 4 marks each
        } else {
            wrongAnswers++;
        }
    });

    /** -------------------------
     *   CODING SCORING (AUTO)
     *  ------------------------*/
    let codingScore = 0;

    for (const problemId in submission.codingAnswers) {
        const codingAns = submission.codingAnswers[problemId];
        if (!codingAns.submissionResult) continue;

        const passed = codingAns.submissionResult.passed;
        const total = codingAns.submissionResult.total;

        if (total > 0) {
            codingScore = (passed / total) * 30; // auto-score out of 30
        }
    }

    score += codingScore;

    /** -------------------------
     *   TIME-BASED SCORING
     *  ------------------------*/
    /** TIME-BASED SCORING */
const round1 = rounds.find(r => r.id === 1);

if (
    round1 &&
    typeof round1.startedAt === "string" &&
    round1.startedAt.trim() !== ""
) {
    const roundStart = new Date(round1.startedAt);
    const submittedAt = new Date(submission.submittedAt);

    let minutesTaken =
        (submittedAt.getTime() - roundStart.getTime()) / 60000;

    // Wrong answers add +5 min each
    minutesTaken += wrongAnswers * 5;

    // Bonus inside first 10 minutes
    if (minutesTaken <= 10) {
        score += 5;
    }

    // Late penalty
    if (round1.durationInMinutes && minutesTaken > round1.durationInMinutes) {
        const late = minutesTaken - round1.durationInMinutes;
        score -= late * 0.1;
    }
}


    if (score < 0) score = 0;

    setSubmissions(prev =>
        prev.map(s =>
            s.teamId === teamId
                ? { ...s, score: Math.round(score) }
                : s
        )
    );
};
;
    
    const awardCertificate = (teamId: string, teamName: string, type: CertificateType) => {
        const newCertificate: Certificate = { 
            teamId, 
            teamName, 
            type, 
            awardedAt: new Date() 
        };
        setCertificates(prev => [...prev, newCertificate]);
    };

    const getRoundById = (roundId: number) => rounds.find(r => r.id === roundId);
    const getTeamSubmission = (teamId: string) => submissions.find(s => s.teamId === teamId);

    const value: ContestContextType = {
        rounds, mcqs, codingProblems, submissions, round2Problem, certificates,
        startRound, endRound, setRoundDuration, addMcq, addCodingProblem,
        submitRound1, getRoundById, getTeamSubmission, updateRound2Problem,
        calculateRound1Score, awardCertificate,
    };

    return (
        <ContestContext.Provider value={value}>
            {children}
        </ContestContext.Provider>
    );
};
