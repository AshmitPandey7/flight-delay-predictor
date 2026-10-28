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
    try {
      animate('.anime-hero-badge', {
        opacity: [0, 1],
        translateY: [-15, 0],
        duration: 700,
        ease: 'outExpo'
      });

      animate('.anime-hero-title', {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 800,
        ease: 'outExpo',
        delay: 150
      });

      animate('.anime-hero-desc', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        ease: 'outExpo',
        delay: 250
      });

      animate('.anime-hero-btn', {
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 700,
        ease: 'outExpo',
        delay: 350
      });

      animate('.anime-feature-card', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        ease: 'outExpo',
        delay: stagger(100, { start: 450 })
      });

      animate('.anime-floating-plane', {
        translateY: [-4, 4],
        duration: 3000,
        ease: 'inOutSine',
        alternate: true,
        loop: true
      });
    } catch (e) {
      console.warn("Anime.js animation initialized safely", e);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Top Navigation Bar */}
      <nav className="w-full border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onEnterApp}>
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm shrink-0">
              <Plane size={18} className="transform -rotate-45" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                AeroProb
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase leading-tight">
                Flight Disruption Predictor
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#data-sources" className="hover:text-white transition">Verified Datasets</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchFacultyDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              title="One-click Faculty Demo: Instant Chennai to Mumbai evaluation"
            >
              <GraduationCap size={15} />
              <span>Faculty Demo</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition shadow-sm cursor-pointer"
            >
              <LogIn size={14} />
              <span>Sign In / Enter</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#09090b]/90 to-[#09090b]"></div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-28 flex flex-col items-center text-center">
          
          {/* Top Badge */}
          <div className="anime-hero-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium mb-6">
            <Sparkles size={13} className="text-zinc-400" />
            <span>Calibrated Machine Learning & Bayes' Theorem Architecture</span>
          </div>

          {/* Headline */}
          <h1 className="anime-hero-title text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5 max-w-4xl leading-[1.1]">
            Fly Smarter. <br />
            <span className="text-zinc-400">
              Travel with Confidence.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="anime-hero-desc text-sm sm:text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">
            Airlines publish flight timetables, but never your probability of on-time arrival. 
            AeroProb analyzes real historical operations, live Open-Meteo meteorological telemetry, 
            and DGCA India benchmarks to predict calibrated On-Time, Delay, and Cancellation probabilities.
          </p>

          {/* Call-To-Action Buttons */}
          <div className="anime-hero-btn flex flex-wrap items-center justify-center gap-3.5 mb-14">
            <button
              onClick={onEnterApp}
              className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Flights & Predict Delays</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onLaunchFacultyDemo}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <GraduationCap size={15} />
              <span>Launch 1-Click Faculty Demo</span>
            </button>

            <a
              href="#how-it-works"
              className="px-4 py-3 text-zinc-400 hover:text-white font-medium text-xs transition flex items-center gap-1"
            >
              <span>How It Works</span>
              <ChevronRight size={14} />
            </a>
          </div>

          {/* Decorative Floating Aircraft Card */}
          <div className="anime-floating-plane w-full max-w-2xl p-5 rounded-2xl bg-[#121214] border border-zinc-800 shadow-xl text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs border border-zinc-800">
                  6E
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">IndiGo 6E 2041</h4>
                  <p className="text-[11px] text-zinc-500">Chennai (MAA) → Mumbai (BOM) • Airbus A321neo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Low Risk
                </span>
                <span className="text-xs font-bold text-white">₹4,250</span>
              </div>
            </div>

            {/* Segmented Probability Bar */}
            <div className="mt-3.5 space-y-1.5">
              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden flex border border-zinc-800">
                <div style={{ width: '84.2%' }} className="bg-emerald-500 h-full" title="84.2% On-Time"></div>
                <div style={{ width: '13.6%' }} className="bg-amber-500 h-full" title="13.6% Delayed"></div>
                <div style={{ width: '2.2%' }} className="bg-rose-500 h-full" title="2.2% Cancelled"></div>
              </div>
              <div className="flex justify-between text-xs text-zinc-300 pt-1">
                <span>On-Time: <strong className="text-emerald-400 font-semibold">84.2%</strong> [95% CI: 83.1% - 85.3%]</span>
                <span>Delayed (&gt;15m): <strong className="text-amber-400 font-semibold">13.6%</strong></span>
                <span>Cancelled: <strong className="text-rose-400 font-semibold">2.2%</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section: How It Works */}
      <section id="how-it-works" className="py-20 px-6 border-b border-zinc-800 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              End-to-End Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              How AeroProb Solves Uncertainty
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Combining pre-departure scheduled route characteristics with live meteorological data 
              and official DGCA priors to calculate true posterior probabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="anime-feature-card p-6 rounded-xl bg-[#121214] border border-zinc-800 text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-4 border border-zinc-800">
                  <Compass size={20} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">1. Flight Search & Timetable</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Search across top Indian metro airports (Chennai, Mumbai, Delhi, Bengaluru, Hyderabad) and international gateways with MakeMyTrip-style convenience and authentic scheduled airline routes.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 font-medium">
                Verified Carrier Networks
              </div>
            </div>

            <div className="anime-feature-card p-6 rounded-xl bg-[#121214] border border-zinc-800 text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-4 border border-zinc-800">
                  <CloudRain size={20} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">2. Live Atmospheric Telemetry</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Queries Open-Meteo's weather API using exact airport coordinates for precipitation, wind gusts, and visibility. Supports CAT III winter fog simulations for forward bookings.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 font-medium">
                Real-Time Meteorological Input
              </div>
            </div>

            <div className="anime-feature-card p-6 rounded-xl bg-[#121214] border border-zinc-800 text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-4 border border-zinc-800">
                  <Activity size={20} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">3. Calibrated ML & Bayes Updates</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Evaluates flight features with a leakage-free Calibrated Multinomial Logistic Regression model and updates priors using Bayes' Theorem, generating 95% Wilson confidence intervals.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 font-medium">
                Statistically Verified Probabilities
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Section: Data Sources */}
      <section id="data-sources" className="py-20 px-6 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          <div className="text-left space-y-5">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Integrity First
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              Strict Zero-Fabricated Data Architecture
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every probability, baseline prior, and hypothesis test stems from verifiable, authentic government datasets:
            </p>
            
            <ul className="space-y-3.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-white shrink-0 mt-0.5" />
                <span><strong className="text-zinc-200">US Bureau of Transportation Statistics (BTS):</strong> 538,000+ verified commercial flights used for feature training and holdout validation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-white shrink-0 mt-0.5" />
                <span><strong className="text-zinc-200">Directorate General of Civil Aviation (DGCA) India:</strong> Official published airline OTP reports calibrating priors for IndiGo, Air India, Akasa Air, and SpiceJet.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-white shrink-0 mt-0.5" />
                <span><strong className="text-zinc-200">Open-Meteo High-Resolution APIs:</strong> Live observed meteorological data and forecast telemetry queried dynamically by airport lat/lon coordinates.</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <span>Launch Flight Search</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Visual Data Metric Box */}
          <div className="grid grid-cols-2 gap-3.5 text-left">
            <div className="p-5 rounded-xl bg-[#121214] border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-white block mb-0.5">538,837</span>
              <span className="text-xs font-semibold text-zinc-300 block mb-0.5">Verified Operations</span>
              <p className="text-[11px] text-zinc-500">BTS full population training & forward holdout testing</p>
            </div>

            <div className="p-5 rounded-xl bg-[#121214] border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-white block mb-0.5">76.1%</span>
              <span className="text-xs font-semibold text-zinc-300 block mb-0.5">Calibrated Accuracy</span>
              <p className="text-[11px] text-zinc-500">Platt-scaled with 0.374 Brier reliability score</p>
            </div>

            <div className="p-5 rounded-xl bg-[#121214] border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-white block mb-0.5">95%</span>
              <span className="text-xs font-semibold text-zinc-300 block mb-0.5">Wilson Confidence</span>
              <p className="text-[11px] text-zinc-500">Asymmetric confidence intervals on all probability outputs</p>
            </div>

            <div className="p-5 rounded-xl bg-[#121214] border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-white block mb-0.5">5</span>
              <span className="text-xs font-semibold text-zinc-300 block mb-0.5">Hypothesis Tests</span>
              <p className="text-[11px] text-zinc-500">Welch's t-test, Chi-Square, ANOVA, z-test, and Pearson correlation</p>
            </div>
          </div>

        </div>
      </section>

      {/* Global Landing Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800 bg-[#09090b] text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold">
              <Plane size={15} className="transform -rotate-45" />
            </div>
            <div>
              <p className="font-semibold text-zinc-300">AeroProb Aviation Intelligence Platform</p>
              <p>Predicting flight delays & cancellations with calibrated statistics.</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={onLaunchFacultyDemo} className="hover:text-white transition font-medium cursor-pointer">
              Faculty Demo Mode
            </button>
            <button onClick={onEnterApp} className="hover:text-white transition font-medium cursor-pointer">
              Flight Search
            </button>
            <button onClick={onOpenAuth} className="hover:text-white transition font-medium cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}