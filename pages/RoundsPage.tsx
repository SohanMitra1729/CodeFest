import React from 'react';
import Section from '../components/Section';

const rounds = [
  {
    name: 'Round 1: Online Challenge',
    description: 'An online preliminary round combining a time-bound MCQ quiz and a set of coding challenges. This round tests your fundamental CS knowledge, logical reasoning, and problem-solving skills.',
    icon: (
      <svg className="w-12 h-12 text-[#E23C60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: 'Round 2: Project Submission',
    description: 'Shortlisted teams will be given a single, detailed problem statement. Your task is to develop a comprehensive software solution and submit the complete project files. This round evaluates your development skills, creativity, and ability to build a functional application.',
    icon: (
        <svg className="w-12 h-12 text-[#E23C60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
  },
  {
    name: 'Round 3: Offline Hackathon',
    description: 'The final round is a 24-hour offline hackathon at the NIT Silchar campus. Top teams will build a functional prototype of their solution for a given problem statement. This is where innovation, teamwork, and presentation skills come into play.',
    icon: (
      <svg className="w-12 h-12 text-[#E23C60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 21.75l4.5-4.5-4.5-4.5m4.5 9l-4.5-4.5 4.5-4.5M14.25 2.25l-4.5 4.5 4.5 4.5m-4.5-9l4.5 4.5-4.5 4.5" />
      </svg>
    ),
  },
];

const RoundsPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up bg-pro-gradient min-h-screen py-8">
      <Section title="Competition Rounds" subtitle="The journey to victory is spread across three challenging rounds.">
        <div className="space-y-8 max-w-4xl mx-auto">
          {rounds.map((round, index) => (
            <div key={round.name} className="flex flex-col md:flex-row items-start gap-6 p-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-[#E23C60]/30 rounded-xl shadow-xl hover:shadow-2xl hover:border-[#E23C60]/60 hover:from-white/15 hover:to-white/8 transition-all duration-300 group">
              <div className="flex-shrink-0 text-[#E23C60] group-hover:scale-110 transition-transform duration-300 bg-white/10 p-4 rounded-lg">
                {round.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text">Round {index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#E23C60] group-hover:to-[#F589A0] group-hover:bg-clip-text transition-all">{round.name}</h3>
                <p className="mt-3 text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{round.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default RoundsPage;