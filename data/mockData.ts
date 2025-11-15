import { User, Team, Round, MCQ, CodingProblem, Round1Submission, Round2Problem, Certificate, UserRole } from '../types';

// MOCK USERS
export const mockUsers: User[] = [
    { id: 'admin-1', name: 'Admin User', email: 'admin@test.com', role: UserRole.ADMIN, password: 'adminpassword' },
    { id: 'leader-1', name: 'Alice Leader', email: 'alice@test.com', role: UserRole.TEAM_LEADER, teamId: 'team-1', password: 'password123' },
    { id: 'member-1', name: 'Bob Member', email: 'bob@test.com', role: UserRole.TEAM_MEMBER, teamId: 'team-1', password: 'password123' },
    { id: 'leader-2', name: 'Charlie Leader', email: 'charlie@test.com', role: UserRole.TEAM_LEADER, teamId: 'team-2', password: 'password123' },
    { id: 'leader-3', name: 'Diana Leader', email: 'diana@test.com', role: UserRole.TEAM_LEADER, teamId: 'team-3', password: 'password123' },
    { id: 'leader-4', name: 'Eve Leader', email: 'eve@test.com', role: UserRole.TEAM_LEADER, teamId: 'team-4', password: 'password123' },
    { id: 'guest-1', name: 'Frank Guest', email: 'frank@test.com', role: UserRole.GUEST, password: 'password123' },
];

// MOCK TEAMS
export const mockTeams: Team[] = [
    {
        id: 'team-1',
        name: 'Code Wizards',
        college: 'NIT Silchar',
        members: [
            { id: 1, name: 'Alice Leader', email: 'alice@test.com', role: 'Leader' },
            { id: 2, name: 'Bob Member', email: 'bob@test.com', role: 'Member' },
            { id: 3, name: 'Member C', email: 'c@test.com', role: 'Member' },
        ],
        paymentScreenshotUrl: 'https://picsum.photos/seed/payment1/400/200',
        status: 'Approved',
    },
    {
        id: 'team-2',
        name: 'Binary Bandits',
        college: 'IIT Guwahati',
        members: [
            { id: 4, name: 'Charlie Leader', email: 'charlie@test.com', role: 'Leader' },
        ],
        paymentScreenshotUrl: 'https://picsum.photos/seed/payment2/400/200',
        status: 'Approved',
    },
    {
        id: 'team-3',
        name: 'Syntax Savages',
        college: 'Jadavpur University',
        members: [
            { id: 5, name: 'Diana Leader', email: 'diana@test.com', role: 'Leader' },
        ],
        paymentScreenshotUrl: 'https://picsum.photos/seed/payment3/400/200',
        status: 'Pending',
    },
     {
        id: 'team-4',
        name: 'Algo Avengers',
        college: 'NIT Trichy',
        members: [
            { id: 6, name: 'Eve Leader', email: 'eve@test.com', role: 'Leader' },
        ],
        paymentScreenshotUrl: 'https://picsum.photos/seed/payment4/400/200',
        status: 'Rejected',
    },
];

// MOCK CONTEST DATA
export const mockRounds: Round[] = [
    { id: 1, name: 'Round 1: Online Challenge', status: 'Not Started', durationInMinutes: 90 },
    { id: 2, name: 'Round 2: Project Submission', status: 'Locked' },
    { id: 3, name: 'Round 3: Offline Hackathon', status: 'Locked' },
];

export const mockMCQs: MCQ[] = [
    {
        id: 'mcq-1',
        question: 'What is the time complexity of a binary search algorithm?',
        options: [
            { id: 'a', text: 'O(n)' },
            { id: 'b', text: 'O(log n)' },
            { id: 'c', text: 'O(n^2)' },
            { id: 'd', text: 'O(1)' },
        ],
        correctAnswerId: 'b',
    },
    {
        id: 'mcq-2',
        question: 'Which of the following is NOT a JavaScript framework?',
        options: [
            { id: 'a', text: 'React' },
            { id: 'b', text: 'Vue' },
            { id: 'c', text: 'Angular' },
            { id: 'd', text: 'Sass' },
        ],
        correctAnswerId: 'd',
    }
];

export const mockCodingProblems: CodingProblem[] = [
  {
    id: 'cp-1',
    title: 'Palindrome Checker',
    description:
      'Write a function that checks if a given string is a palindrome. The function should be case-insensitive and ignore non-alphanumeric characters.',
    displayedTestCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true' },
      { input: 'race a car', expectedOutput: 'false' },
    ],
    hiddenTestCases: [
      { input: '', expectedOutput: 'true' },
      { input: 'No lemon, no melon', expectedOutput: 'true' },
      { input: 'hello world', expectedOutput: 'false' },
    ],
  },
];


export const mockSubmissions: Round1Submission[] = [
    {
        teamId: 'team-1',
        submittedAt: new Date('2025-10-01T10:30:00Z'),
        mcqAnswers: { 'mcq-1': 'b', 'mcq-2': 'd' },
        codingAnswers: { 'cp-1': { code: 'function isPalindrome(str) { ... }', language: 'javascript', submissionResult: { passed: 3, total: 3 } } },
        score: 20, // 10 for each correct MCQ
    },
     {
        teamId: 'team-2',
        submittedAt: new Date('2025-10-01T10:35:00Z'),
        mcqAnswers: { 'mcq-1': 'b', 'mcq-2': 'a' },
        codingAnswers: { 'cp-1': { code: 'function isPalindrome(str) { ... }', language: 'javascript', submissionResult: { passed: 2, total: 3 } } },
        score: 10,
    }
];

export const mockRound2Problem: Round2Problem = {
    title: 'Real-time Chat Application API',
    description: 'Design and build the backend API for a real-time chat application. The API should support user authentication, creating chat rooms, sending messages, and retrieving message history. Use WebSockets for real-time communication.',
    url: 'https://example.com/project-docs'
};

export const mockCertificates: Certificate[] = [
    { teamId: 'team-1', teamName: 'Code Wizards', type: 'Appreciation', awardedAt: new Date() },
];