
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { Prize } from '../types';

// Animated Prize Counter Component - Counts on page load
const PrizeCounter: React.FC<{ amount: string }> = ({ amount }) => {
  const [displayAmount, setDisplayAmount] = useState('₹0');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    // Extract numeric value from amount string
    const numericValue = parseInt(amount.replace(/[₹,]/g, ''));
    let current = 0;
    const increment = Math.ceil(numericValue / 50);
    
    // Start animation after slight delay for visual impact
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayAmount(amount);
          setHasAnimated(true);
          clearInterval(interval);
        } else {
          setDisplayAmount(`₹${(current).toLocaleString('en-IN')}`);
        }
      }, 25);
    }, 300);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [amount, hasAnimated]);

  return <span className="font-black">{displayAmount}</span>;
};

const prizes: Prize[] = [
    { rank: '1st Place', amount: '₹2,50,000', perks: ['Internship interviews', 'Premium Goodies', '₹50,000 Cloud Credits'] },
    { rank: '2nd Place', amount: '₹1,50,000', perks: ['Internship interviews', 'Goodies', '₹25,000 Cloud Credits'] },
    { rank: '3rd Place', amount: '₹1,00,000', perks: ['Internship interviews', 'Goodies', '₹10,000 Cloud Credits'] },
    { rank: 'Best All-Girls Team', amount: '₹25,000', perks: ['Special Mention', 'Mentorship Sessions'] },
    { rank: 'Best First-Year Team', amount: '₹15,000', perks: ['Special Mention', 'Mentorship Sessions'] },
];

const PrizeCard: React.FC<{ prize: Prize, isWinner?: boolean }> = ({ prize, isWinner = false }) => {
  const badgeMap: { [key: string]: string } = {
    '1st Place': '🥇',
    '2nd Place': '🥈',
    '3rd Place': '🥉',
    'Best All-Girls Team': '👩‍💻',
    'Best First-Year Team': '⭐'
  };

  return (
    <div className={`border rounded-2xl p-6 text-center transition-all transform hover:-translate-y-4 hover:scale-105 hover:shadow-2xl cursor-pointer group ${isWinner ? 'bg-gradient-to-br from-[#E23C60] via-[#D1184E] to-[#B21245] text-white border-[#E23C60] shadow-xl shadow-[#E23C60]/40 hover:shadow-[#E23C60]/80 hover:border-white' : 'bg-white/10 backdrop-blur-md border-[#E23C60]/30 hover:border-[#E23C60]/80 text-gray-200'}`}>
      <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">{badgeMap[prize.rank] || '🎯'}</div>
      <h3 className={`font-bold text-lg mb-3 group-hover:scale-105 transition-transform origin-center ${isWinner ? 'text-white drop-shadow-lg' : 'text-[#E23C60]'}`}>{prize.rank}</h3>
      <p className={`text-4xl font-black mb-4 transition-all duration-300 ${isWinner ? 'text-white drop-shadow-lg' : 'text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text'}`}>
        <PrizeCounter amount={prize.amount} />
      </p>
      <ul className={`space-y-2 text-xs font-semibold ${isWinner ? 'text-white/90' : 'text-gray-300'}`}>
          {prize.perks.map(perk => <li key={perk} className="flex items-center justify-center gap-1 group-hover:text-white transition">
              <span className="text-[#E23C60]">✓</span> <span>{perk}</span>
          </li>)}
      </ul>
    </div>
  );
};


const PrizesPage: React.FC = () => {
    return (
        <div className="animate-fade-in-up bg-pro-gradient min-h-screen py-6">
            <Section title="Prizes and Recognition" subtitle="Unleash your potential. Claim your glory. Transform ideas into reality.">
                <div className="grid md:grid-cols-3 gap-6">
                    {prizes.map((prize, index) => (
                        <PrizeCard key={prize.rank} prize={prize} isWinner={index < 3} />
                    ))}
                </div>

                {/* Prize Breakdown Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-xl p-5 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                        <p className="text-3xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition">5</p>
                        <p className="text-xs text-gray-300 mt-2 font-semibold">Categories</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-xl p-5 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                        <p className="text-3xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition">∞</p>
                        <p className="text-xs text-gray-300 mt-2 font-semibold">Opportunities</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-xl p-5 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                        <p className="text-3xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition">100%</p>
                        <p className="text-xs text-gray-300 mt-2 font-semibold">Recognition</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-xl p-5 text-center hover:border-[#E23C60]/80 transition-all group cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-[#E23C60]/30">
                        <p className="text-3xl font-black text-[#E23C60] group-hover:text-[#F589A0] transition">🎯</p>
                        <p className="text-xs text-gray-300 mt-2 font-semibold">Excellence</p>
                    </div>
                </div>
                 
                 <div className="text-center mt-12 p-8 bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-[#E23C60]/40 rounded-2xl hover:border-[#E23C60]/80 transition-all hover:shadow-2xl hover:shadow-[#E23C60]/40 group">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
                    <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text mb-3 group-hover:text-white transition">Certificates & Recognition</h3>
                    <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed text-sm">
                        Every participant earns a <span className="text-[#E23C60] font-bold">Certificate of Participation</span>. Elite teams receive <span className="text-[#E23C60] font-bold">Certificates of Excellence</span> with lifetime recognition on our platform!
                    </p>
                </div>
            </Section>
        </div>
    );
};

export default PrizesPage;
