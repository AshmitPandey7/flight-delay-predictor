import { useEffect, useRef } from 'react';
import {
  Plane, ArrowRight, ShieldCheck, Sparkles, CloudRain,
  GraduationCap, LogIn, ChevronRight, Compass, Activity
} from 'lucide-react';
import { animate, stagger } from 'animejs';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  onLaunchFacultyDemo: () => void;
}

export default function LandingPage({
  onEnterApp,
  onOpenAuth,
  onLaunchFacultyDemo
}: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run Anime.js entrance animations
    try {
      animate('.anime-hero-badge', {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        ease: 'outExpo'
      });

      animate('.anime-hero-title', {
        opacity: [0, 1],
        translateY: [35, 0],
        duration: 1000,
        ease: 'outExpo',
        delay: 200
      });

      animate('.anime-hero-desc', {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 900,
        ease: 'outExpo',
        delay: 350
      });

      animate('.anime-hero-btn', {
        opacity: [0, 1],
        scale: [0.94, 1],
        duration: 800,
        ease: 'outExpo',
        delay: 500
      });

      animate('.anime-feature-card', {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        ease: 'outExpo',
        delay: stagger(150, { start: 600 })
      });

      // Subtle continuous floating motion for aircraft graphic
      animate('.anime-floating-plane', {
        translateY: [-6, 6],
        rotate: [-1, 1],
        duration: 3500,
        ease: 'inOutSine',
        alternate: true,
        loop: true
      });
    } catch (e) {
      console.warn("Anime.js animation initialized safely", e);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#07070b] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Premium Top Navigation Bar */}
      <nav className="w-full border-b border-purple-500/15 bg-[#090910]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={onEnterApp}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 border border-purple-400/30">
              <Plane size={24} className="transform -rotate-45" />
            </div>
            <div className="text-left">
              <span className="font-black text-xl tracking-tight text-white block leading-none">
                AeroProb
              </span>
              <span className="text-[11px] text-purple-400/90 font-semibold tracking-wider uppercase">
                Aviation Delay Intelligence
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a>
            <a href="#booking-experience" className="hover:text-purple-400 transition">Booking Interface</a>
            <a href="#probability-science" className="hover:text-purple-400 transition">Mathematical Science</a>
            <a href="#data-sources" className="hover:text-purple-400 transition">Verified Data</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchFacultyDemo}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-bold transition hover:scale-105 shadow-sm cursor-pointer"
              title="One-click Faculty Demo: Instant Chennai to Mumbai evaluation"
            >
              <GraduationCap size={16} className="text-purple-400" />
              <span>Faculty Demo</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold transition hover:shadow-lg hover:shadow-purple-600/25 cursor-pointer"
            >
              <LogIn size={15} />
              <span>Sign In / Enter</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="relative w-full overflow-hidden border-b border-purple-500/10">
        
        {/* Layered Cinematic Atmospheric Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
        
        {/* Deep Violet Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070b]/60 via-[#07070b]/90 to-[#07070b]"></div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
          
          {/* Top Badge */}
          <div className="anime-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-8 shadow-inner shadow-purple-500/20">
            <Sparkles size={14} className="text-purple-400" />
            <span>Calibrated Machine Learning & Bayes' Theorem Architecture</span>
          </div>

          {/* Headline */}
          <h1 className="anime-hero-title text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 max-w-5xl leading-[1.08]">
            Fly Smarter. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">
              Travel with Confidence.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="anime-hero-desc text-base sm:text-xl text-slate-300/90 mb-10 max-w-3xl leading-relaxed">
            Airlines publish flight timetables, but never your probability of on-time arrival. 
            AeroProb analyzes real historical operations, live Open-Meteo meteorological telemetry, 
            and DGCA India benchmarks to predict calibrated On-Time, Delay, and Cancellation probabilities.
          </p>

          {/* Call-To-Action Buttons */}
          <div className="anime-hero-btn flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm transition-all hover:scale-105 shadow-xl shadow-purple-600/30 flex items-center gap-3 cursor-pointer"
            >
              <span>Explore Flights & Predict Delays</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={onLaunchFacultyDemo}
              className="px-7 py-4 bg-[#12121c] hover:bg-[#1a1a29] text-purple-200 border border-purple-500/30 hover:border-purple-400/50 font-bold rounded-2xl text-sm transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <GraduationCap size={18} className="text-purple-400" />
              <span>Launch 1-Click Faculty Demo</span>
            </button>

            <a
              href="#how-it-works"
              className="px-6 py-4 text-slate-400 hover:text-white font-semibold text-sm transition flex items-center gap-1.5"
            >
              <span>Explore How It Works</span>
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Hero Decorative Floating Aircraft Card */}
          <div className="anime-floating-plane w-full max-w-3xl p-6 rounded-3xl bg-gradient-to-b from-[#131322]/90 to-[#0c0c16]/90 border border-purple-500/25 shadow-2xl shadow-purple-950/40 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  6E
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">IndiGo 6E 2041</h4>
                  <p className="text-xs text-slate-400">Chennai (MAA) → Mumbai (BOM) • Airbus A321neo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Low Disruption Risk
                </span>
                <span className="text-sm font-black text-slate-100">₹4,250</span>
              </div>
            </div>

            {/* Segmented Probability Bar */}
            <div className="mt-4 space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
                <div style={{ width: '84.2%' }} className="bg-emerald-500 h-full" title="84.2% On-Time"></div>
                <div style={{ width: '13.6%' }} className="bg-amber-500 h-full" title="13.6% Delayed"></div>
                <div style={{ width: '2.2%' }} className="bg-rose-500 h-full" title="2.2% Cancelled"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-300 pt-1">
                <span>On-Time: <strong className="text-emerald-400">84.2%</strong> [95% CI: 83.1% - 85.3%]</span>
                <span>Delayed (&gt;15m): <strong className="text-amber-400">13.6%</strong></span>
                <span>Cancelled: <strong className="text-rose-400">2.2%</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Storytelling Section 1: How It Works */}
      <section id="how-it-works" className="py-28 px-6 border-b border-purple-500/10 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-2">
              End-to-End Intelligence
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              How AeroProb Solves Uncertainty
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Combining pre-departure scheduled route characteristics with live meteorological data 
              and official DGCA priors to calculate true posterior probabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="anime-feature-card p-8 rounded-3xl bg-[#0e0e18] border border-purple-500/20 hover:border-purple-500/40 transition-all text-left flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition">
                  <Compass size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. Flight Search & Timetable</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Search across top Indian metro airports (Chennai, Mumbai, Delhi, Bengaluru, Hyderabad) and international gateways with MakeMyTrip-style convenience and authentic scheduled airline routes.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-500/15 text-xs text-purple-400 font-semibold flex items-center gap-1">
                <span>Verified Carrier Networks</span>
              </div>
            </div>

            <div className="anime-feature-card p-8 rounded-3xl bg-[#0e0e18] border border-purple-500/20 hover:border-purple-500/40 transition-all text-left flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6 border border-violet-500/20 group-hover:scale-110 transition">
                  <CloudRain size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. Live Atmospheric Telemetry</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Queries Open-Meteo's weather API using exact airport coordinates for precipitation, wind gusts, and visibility. Supports CAT III winter fog simulations for forward bookings.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-500/15 text-xs text-violet-400 font-semibold flex items-center gap-1">
                <span>Real-Time Meteorological Input</span>
              </div>
            </div>

            <div className="anime-feature-card p-8 rounded-3xl bg-[#0e0e18] border border-purple-500/20 hover:border-purple-500/40 transition-all text-left flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition">
                  <Activity size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3. Calibrated ML & Bayes Updates</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates flight features with a leakage-free Calibrated Multinomial Logistic Regression model and updates priors using Bayes' Theorem, generating 95% Wilson confidence intervals.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-500/15 text-xs text-indigo-400 font-semibold flex items-center gap-1">
                <span>Statistically Verified Probabilities</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Storytelling Section 2: Zero Fabricated Data */}
      <section id="data-sources" className="py-24 px-6 bg-[#0a0a12] border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="text-left space-y-6">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
              Integrity First
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Strict Zero-Fabricated Data Architecture
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every probability, baseline prior, and hypothesis test stems from verifiable, authentic government datasets:
            </p>
            
            <ul className="space-y-4 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-purple-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">US Bureau of Transportation Statistics (BTS):</strong> 538,000+ verified commercial flights used for feature training and holdout validation.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-purple-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Directorate General of Civil Aviation (DGCA) India:</strong> Official published airline OTP reports calibrating priors for IndiGo, Air India, Akasa Air, and SpiceJet.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-purple-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Open-Meteo High-Resolution APIs:</strong> Live observed meteorological data and forecast telemetry queried dynamically by airport lat/lon coordinates.</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <span>Launch Flight Search</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Visual Data Metric Box */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-6 rounded-3xl bg-[#121220] border border-purple-500/20">
              <span className="text-3xl sm:text-4xl font-black text-white block mb-1">538,837</span>
              <span className="text-xs font-bold text-purple-300 block mb-1">Verified Operations</span>
              <p className="text-[11px] text-slate-400">BTS full population training & forward holdout testing</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#121220] border border-purple-500/20">
              <span className="text-3xl sm:text-4xl font-black text-purple-400 block mb-1">76.1%</span>
              <span className="text-xs font-bold text-slate-200 block mb-1">Calibrated Accuracy</span>
              <p className="text-[11px] text-slate-400">Platt-scaled with 0.374 Brier reliability score</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#121220] border border-purple-500/20">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 block mb-1">95%</span>
              <span className="text-xs font-bold text-slate-200 block mb-1">Wilson Confidence</span>
              <p className="text-[11px] text-slate-400">Asymmetric confidence intervals on all probability outputs</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#121220] border border-purple-500/20">
              <span className="text-3xl sm:text-4xl font-black text-violet-400 block mb-1">5</span>
              <span className="text-xs font-bold text-slate-200 block mb-1">Hypothesis Tests</span>
              <p className="text-[11px] text-slate-400">Welch's t-test, Chi-Square, ANOVA, z-test, and Pearson correlation</p>
            </div>
          </div>

        </div>
      </section>

      {/* Global Landing Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/15 bg-[#050509] text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
              <Plane size={16} className="transform -rotate-45" />
            </div>
            <div>
              <p className="font-bold text-slate-300">AeroProb Aviation Intelligence Platform</p>
              <p>Predicting flight delays & cancellations with calibrated statistics.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onLaunchFacultyDemo} className="hover:text-purple-400 transition font-semibold">
              Faculty Demo Mode
            </button>
            <button onClick={onEnterApp} className="hover:text-purple-400 transition font-semibold">
              Flight Search
            </button>
            <button onClick={onOpenAuth} className="hover:text-purple-400 transition font-semibold">
              Sign In
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
