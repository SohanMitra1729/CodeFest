import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Section from "../components/Section";

// Simple Image Carousel for hero background
const ImageCarousel: React.FC<{ images: string[]; interval?: number }> = ({ images, interval = 5000 }) => {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Array<'pending' | 'ok' | 'err'>>([]);

  // Preload images and track load/error state
  useEffect(() => {
    if (!images || images.length === 0) return;
    let isMounted = true;
    const arr: Array<'pending' | 'ok' | 'err'> = images.map(() => 'pending');
    setStatus(arr);

    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!isMounted) return;
        setStatus((prev) => {
          const next = [...prev];
          const hadAnyOk = prev.some((s) => s === 'ok');
          next[i] = 'ok';
          // When the first successful image loads, jump to it so users don't see a broken placeholder first
          if (!hadAnyOk) setIndex(i);
          return next;
        });
      };
      img.onerror = () => {
        if (!isMounted) return;
        console.warn(`Carousel image failed to load: ${src}`);
        setStatus((prev) => {
          const next = [...prev];
          next[i] = 'err';
          return next;
        });
      };
    });

    return () => {
      isMounted = false;
    };
  }, [images]);

  // Start auto-advance only after at least one image successfully loads
  useEffect(() => {
    if (!images || images.length === 0) return;
    const anyOk = status.some((s) => s === 'ok');
    if (!anyOk) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval, status]);

  return (
    <div className="absolute inset-0 -z-10">
      {images.map((src, i) => {
        const isActive = i === index;
        const s = status[i] ?? 'pending';

        // If image loaded successfully, render it. If it errored, render a graceful placeholder.
        if (s === 'ok') {
          return (
            <img
              key={i}
              src={src}
              alt={`hero-${i}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out transform filter brightness-75 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ transitionProperty: 'opacity, transform', objectPosition: 'center' }}
            />
          );
        }

        // Placeholder / skeleton for pending or errored images (prevents browser broken-image icon)
        return (
          <div
            key={i}
            aria-hidden
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out transform flex items-center justify-center ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020] via-[#11121a] to-[#0b0d12]" />
            <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E23C60]/30 to-[#F589A0]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div className="text-sm text-gray-300 max-w-xs">Image unavailable — using styled background</div>
            </div>
          </div>
        );
      })}

      {/* Navigation dots */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-6 z-20 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${i === index ? 'bg-white/90 scale-110' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Counter component with animation
const Counter: React.FC<{ end: number; label: string; prefix?: string; suffix?: string }> = ({ end, label, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds
    const tick = 50; // ms
    const steps = duration / tick;
    const increment = Math.max(1, Math.floor(end / steps));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, tick);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="group cursor-pointer bg-gradient-to-br from-white/20 to-white/8 backdrop-blur-xl border-2 border-[#E23C60]/50 rounded-2xl p-10 transition-all transform will-change-transform duration-500 hover:-translate-y-3 hover:scale-110 hover:shadow-2xl hover:shadow-[#E23C60]/50 hover:border-[#E23C60] active:scale-95">
      <div className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#E23C60] via-[#F589A0] to-[#E23C60] bg-clip-text text-transparent group-hover:text-white transition-all duration-300" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-lg md:text-xl text-gray-300 mt-4 font-bold uppercase tracking-widest group-hover:text-white group-hover:text-[#E23C60] transition-all duration-300">{label}</div>
    </div>
  );
};

// Timeline
const timelineEvents = [
  { date: "Aug 1, 2025", title: "Registration Opens", description: "Teams can start registering for the hackathon." },
  { date: "Sep 15, 2025", title: "Registration Closes", description: "The deadline for team registrations." },
  { date: "Oct 1, 2025", title: "Round 1: Online Quiz", description: "MCQ round to test foundational knowledge." },
  { date: "Oct 15, 2025", title: "Round 2: Online Coding", description: "Solve coding problems in a timed contest." },
  { date: "Jan 10, 2026", title: "Round 3: Offline Hackathon", description: "Final round at NIT Silchar campus." },
  { date: "Jan 11, 2026", title: "Results & Closing Ceremony", description: "Prizes, certificates & celebration." },
];

// Sponsors / Local asset images
// Only include images that actually exist in the `assets/` folder to avoid broken images
const sponsors = [

  { name: "NIT Silchar", logo: "/assets/nit_silchar.jpg" },
 
  { name: "Side 5", logo: "/assets/sideimage5.jpg" },
];

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in-up bg-pro-gradient min-h-screen">
      {/* HERO: Fullscreen carousel with overlay content */}
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <ImageCarousel
          images={[
            "/assets/nit_silchar.jpg",
            "/assets/sideimage5.jpg",
          ]}
          interval={5000}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#0a0e27]/60 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-[#E23C60]/5 opacity-60" />

        {/* Decorative blobs (kept subtle) */}
        <div className="absolute top-8 right-8 w-72 h-72 bg-gradient-to-br from-[#E23C60]/25 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-tr from-[#E23C60]/18 to-[#F589A0]/8 rounded-full blur-3xl opacity-60" />

        {/* HERO CONTENT: Overlay on carousel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
          <div className="max-w-4xl text-center pointer-events-auto">
            <div className="inline-block mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#E23C60]/20 to-[#F589A0]/20 border border-[#E23C60]/50 backdrop-blur-md shadow-lg shadow-[#E23C60]/20 animate-pulse">
              <span className="text-[#E23C60] font-extrabold text-xs md:text-sm uppercase tracking-[2px]">Innovation Unleashed</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mt-4 mb-4" style={{ textShadow: '0 20px 50px rgba(226, 60, 96, 0.4), 0 8px 16px rgba(0,0,0,0.8)' }}>
              Code<br /><span className="text-transparent bg-gradient-to-r from-[#E23C60] via-[#F589A0] to-[#E23C60] bg-clip-text">Revolution</span>
            </h1>

            <p className="text-gray-200 mt-6 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              NIT Silchar's <span className="font-semibold text-white">Premier 48-Hour Innovation Challenge</span> — Transform ideas into reality, compete with the brightest minds, and win exciting prizes while solving real-world problems.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
              <NavLink to="/registration" className="group inline-block relative bg-gradient-to-r from-[#E23C60] to-[#F589A0] text-white font-bold py-4 px-12 rounded-xl text-base md:text-lg shadow-xl shadow-[#E23C60]/40 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#E23C60]/60 hover:-translate-y-1 active:scale-95">
                <span className="relative z-10">Register Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F589A0] to-[#E23C60] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </NavLink>
              <NavLink to="/rounds" className="group inline-block bg-white/10 backdrop-blur-md text-white font-semibold py-4 px-12 rounded-xl border-2 border-white/20 text-base md:text-lg transition-all duration-300 hover:bg-white/15 hover:border-[#E23C60] hover:text-[#E23C60] hover:scale-105 hover:shadow-xl hover:shadow-[#E23C60]/30 active:scale-95">
                Learn More
              </NavLink>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              <Counter end={1000} label="Participants" suffix="+" />
              <Counter end={100} label="Teams" suffix="+" />
              <Counter end={48} label="Duration" suffix="h" />
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <Section title="Event Timeline" subtitle="Track all important dates at a glance.">
        <div className="flex flex-col gap-10 py-10 max-w-4xl mx-auto">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`p-6 md:p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer group ${
                index % 2 === 0 ? "border-[#E23C60]/40 hover:border-[#E23C60]" : "border-white/20 hover:border-[#E23C60]/60"
              } hover:bg-gradient-to-r hover:from-[#E23C60]/10 hover:to-transparent`}
            >
              <p className="text-sm text-gray-400 font-semibold group-hover:text-[#E23C60] transition-colors">{event.date}</p>
              <h3 className="text-2xl text-white font-bold mt-2 group-hover:text-[#E23C60] transition-colors">{event.title}</h3>
              <p className="text-gray-300 mt-3 group-hover:text-white transition-colors">{event.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PRIZES SECTION */}
      <Section title="Prizes & Rewards" subtitle="Win big rewards, goodies and more!">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Prize Pool: <span className="text-transparent bg-gradient-to-r from-[#E23C60] to-[#F589A0] bg-clip-text">₹5,00,000+</span>
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Top winners receive cash prizes, cloud credits, internships and premium goodies.
          </p>

          <NavLink
            to="/prizes"
            className="font-bold text-[#E23C60] hover:text-[#F589A0] transition text-lg inline-flex items-center gap-2 group"
          >
            See All Prizes <span className="group-hover:translate-x-2 transition-transform">→</span>
          </NavLink>
        </div>
      </Section>

      {/* SPONSORS */}
      <Section title="Our Sponsors" subtitle="Powered by industry-leading organizations.">
        <div className="flex flex-wrap justify-center gap-10 md:gap-20 py-8 px-4">
          {sponsors.map((s) => (
            <div key={s.name} className="group cursor-pointer">
              <img
                src={s.logo}
                alt={s.name}
                className="h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
