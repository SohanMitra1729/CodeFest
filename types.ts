import { ReactNode } from "react";

export interface NavLink {
  name: string;
  path: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Leader' | 'Member';
}

export interface Team {
  id: string;
  name: string;
  college: string;
  members: TeamMember[];
  paymentScreenshotUrl: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export enum UserRole {
  ADMIN = 'admin',
  TEAM_LEADER = 'team_leader',
  TEAM_MEMBER = 'team_member',
  GUEST = 'guest',
}

export interface User {
  id: string; // from supabase.auth.user
  name: string; // from profiles table
  email: string; // from supabase.auth.user
  role: UserRole; // from profiles table
  teamId?: string; // from profiles table
  password?: string; // For mock data only
}

export interface AuthContextType {
  user: User | null;
  teams: Team[];
  login: (email: string, pass: string) => Promise<User>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  signupAdmin: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  registerTeam: (teamName: string, college: string, members: TeamMember[], paymentScreenshot: File) => Promise<string>;
  approveTeam: (teamId: string) => Promise<void>;
  rejectTeam: (teamId: string) => Promise<void>;
}


export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Prize {
  rank: string;
  amount: string;
  perks: string[];
}

// Contest-related types
export type RoundStatus = 'Not Started' | 'Active' | 'Finished' | 'Locked';

export interface Round {
    id: number;
    name: string;
    startedAt?: string;
    status: RoundStatus;
    durationInMinutes?: number;
}

export interface MCQOption {
    id: string;
    text: string;
}

export interface MCQ {
    id: string;
    question: string;
    options: MCQOption[];
    correctAnswerId: string;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
}

export interface CodingProblem {
    id: string;
    title: string;
    description: string;
    displayedTestCases: TestCase[];
    hiddenTestCases: TestCase[];
}

export interface Round1Submission {
    teamId: string;
    submittedAt: Date;
    mcqAnswers: { [mcqId: string]: string }; // mcqId: selectedOptionId
    codingAnswers: { [problemId: string]: { code: string; language: string; submissionResult?: { passed: number; total: number } } };
    score?: number;
}


export interface Round2Problem {
    title: string;
    description: string;
    url?: string;
}

export type CertificateType = 'Participation' | 'Appreciation' | 'Outstanding Performance';

export interface Certificate {
    teamId: string;
    teamName: string;
    type: CertificateType;
    awardedAt: Date;
}

export interface ContestContextType {
    rounds: Round[];
    mcqs: MCQ[];
    codingProblems: CodingProblem[];
    submissions: Round1Submission[];
    round2Problem: Round2Problem;
    certificates: Certificate[];
    startRound: (roundId: number) => void;
    endRound: (roundId: number) => void;
    setRoundDuration: (roundId: number, duration: number) => void;
    addMcq: (mcq: Omit<MCQ, 'id'>) => void;
    addCodingProblem: (problem: Omit<CodingProblem, 'id' | 'displayedTestCases' | 'hiddenTestCases'>) => void;
    submitRound1: (submission: Omit<Round1Submission, 'submittedAt' | 'score'>) => void;
    getRoundById: (roundId: number) => Round | undefined;
    getTeamSubmission: (teamId: string) => Round1Submission | undefined;
    updateRound2Problem: (problem: Round2Problem) => void;
    calculateRound1Score: (teamId: string) => void;
    awardCertificate: (teamId: string, teamName: string, type: CertificateType) => void;
}