"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { ListTodo, ArrowRight, Shield, Zap, Sparkles, CheckCircle2, Clock, BarChart3, ChevronRight, Menu, X, Linkedin, Github, Globe } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Enhanced Framer Motion Animation Variants with smoother transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
      staggerDirection: 1
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0, filter: "blur(15px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      mass: 0.8
    }
  }
};

const smoothFloatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut" as const,
    times: [0, 0.5, 1]
  }
};

const subtleFloatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

function DashboardPreviewComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      animate={subtleFloatAnimation}
      className="mt-16 md:mt-24 w-full relative group px-2 md:px-0"
    >
      <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] -z-10 group-hover:bg-indigo-500/10 transition-colors duration-1000" />
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-xl md:rounded-2xl p-1 md:p-2 shadow-[0_20px_80px_-10px_rgba(0,0,0,0.4)] overflow-hidden ring-1 ring-white/5">
        <div className="bg-slate-950/70 rounded-lg md:rounded-xl overflow-hidden p-2 sm:p-3 md:p-6 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] relative border border-white/5">
          {/* Top Bar Simulation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 sm:mb-4 md:mb-6 pb-2 sm:pb-3 md:pb-4 border-b border-white/5">
            <div className="flex gap-1 sm:gap-1.5 items-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/50" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400/50" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/50" />
            </div>
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-normal">
              <div className="h-3 sm:h-4 md:h-6 w-16 sm:w-20 md:w-40 bg-slate-900 border border-white/5 rounded-md sm:rounded-lg hidden sm:block" />
              <div className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 bg-indigo-600/20 rounded-full border border-indigo-500/20" />
            </div>
          </div>

          <div className="w-full h-full grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 text-left">
            <div className="hidden md:block col-span-3 space-y-4 pr-4 border-r border-white/5">
              <div className="h-3 w-3/4 bg-slate-800 rounded-full mb-6" />
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`h-8 rounded-lg px-2 flex items-center gap-2 border ${i === 1 ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-transparent border-transparent'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-indigo-400' : 'bg-slate-700'}`} />
                  <div className={`h-1.5 rounded-full flex-1 ${i === 1 ? 'bg-indigo-300/30' : 'bg-slate-800'}`} />
                </div>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.1)" as any }}
                    className={`bg-slate-900/40 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl p-3 md:p-5 space-y-3 md:space-y-4 shadow-lg transition-colors ${i > 2 ? 'hidden sm:block' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5 md:space-y-2 flex-1">
                        <div className="h-2.5 md:h-3.5 w-3/4 bg-slate-800 rounded-full" />
                        <div className="h-1.5 md:h-2 w-1/2 bg-slate-800/40 rounded-full" />
                      </div>
                      <div className="h-4 md:h-5 w-8 md:w-10 bg-indigo-500/10 rounded border border-indigo-500/20" />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="h-1.5 md:h-2 w-full bg-slate-800/30 rounded-full" />
                      <div className="h-1.5 md:h-2 w-2/3 bg-slate-800/30 rounded-full" />
                    </div>
                    <div className="pt-2 md:pt-4 flex justify-between items-center border-t border-white/5">
                      <div className="flex gap-1.5 md:gap-2">
                        <div className="h-1.5 md:h-2 w-6 md:w-8 bg-slate-800 rounded-full" />
                        <div className="h-1.5 md:h-2 w-4 md:w-6 bg-slate-800 rounded-full" />
                      </div>
                      <div className="flex -space-x-1.5 md:-space-x-2">
                        {[1, 2, 3].map(j => (
                          <div key={j} className="w-4 md:w-6 h-4 md:h-6 rounded-full border border-slate-950 bg-slate-800" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const DashboardPreview = dynamic(() => Promise.resolve(DashboardPreviewComponent), {
  loading: () => <div className="mt-16 md:mt-24 w-full h-[450px] bg-slate-900/20 animate-pulse rounded-2xl" />,
  ssr: false
});

function FeatureItem({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay,
        duration: 1,
        type: "spring" as const,
        stiffness: 70,
        damping: 15
      }}
      whileHover={{ y: -15, scale: 1.03 }}
      className="group h-full bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden transition-all duration-700 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col"
    >
      <div className="p-4 sm:p-5 bg-slate-800 border border-white/10 rounded-2xl sm:rounded-3xl w-fit mb-6 sm:mb-8 shadow-2xl group-hover:bg-indigo-600 transition-colors duration-500">
        <div className="group-hover:scale-110 group-hover:rotate-[15deg] transition-transform duration-500 text-white group-hover:text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4 tracking-tight uppercase tracking-tighter">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium text-sm opacity-80 group-hover:opacity-100 transition-opacity flex-1">{description}</p>
      <div className="mt-6 sm:mt-8 flex items-center text-[10px] sm:text-xs font-black text-indigo-400 group-hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
        View Details <ChevronRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" />
      </div>
    </motion.div>
  );
}

const StatItem = ({ label, value }: { label: string, value: string }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const targetValue = value.replace(/[^\d.]/g, '');
    const isK = value.includes('k');
    const isM = value.includes('M');
    const isPercentage = value.includes('%');
    const isRating = value.includes('/');

    const end = parseFloat(targetValue) || 0;
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let currentFrame = 0;

    const animateCounter = () => {
      currentFrame++;
      const progress = Math.min(currentFrame / totalFrames, 1);
      const current = Math.floor(progress * end);

      let formattedValue = current.toString();
      if (isK && current >= 1000) {
        formattedValue = (current / 1000).toFixed(1) + 'k';
      }
      if (isM) {
        const actualValue = current / 1000000;
        if (actualValue >= 1) {
          formattedValue = actualValue.toFixed(1) + 'M';
        } else {
          formattedValue = (current / 1000000).toFixed(2) + 'M';
        }
      }
      if (isPercentage) {
        formattedValue = current + '%';
      }
      if (isRating) {
        const rating = 4.0 + (progress * (end - 4.0));
        formattedValue = rating.toFixed(1) + '/5';
      }

      setDisplayValue(formattedValue);

      if (currentFrame < totalFrames) {
        requestAnimationFrame(animateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    const timer = setTimeout(() => {
      animateCounter();
    }, 100);

    return () => clearTimeout(timer);
  }, [value, isInView]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.07, y: -5 }}
      transition={{
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }}
      className="text-center group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all shadow-lg hover:shadow-xl"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:filter group-hover:brightness-125 transition-all">
        {displayValue}
      </div>
      <div className="text-[10px] md:text-xs font-black text-slate-500 tracking-wider uppercase">{label}</div>
    </motion.div>
  );
};

export default function LandingPage() {
  const { state } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      router.push("/dashboard");
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  const floatAnimation = smoothFloatAnimation;

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Smooth Background Glows with Enhanced Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut" as const,
            times: [0, 0.5, 1]
          }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut" as const,
            times: [0, 0.5, 1],
            delay: 1
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 transition-all duration-300">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring" as const,
            stiffness: 80,
            damping: 15,
            mass: 1,
            delay: 0.1
          }}
          className="mx-auto max-w-7xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-[2rem] shadow-2xl shadow-indigo-500/5"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 md:gap-4 group cursor-pointer"
          >
            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-1.5 md:p-2.5 rounded-xl md:rounded-2xl group-hover:rotate-[15deg] transition-transform duration-500 shadow-lg shadow-indigo-500/20">
              <ListTodo className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">PLANIT</span>
          </motion.div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/login" className="hidden sm:block">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Log In
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 md:px-6 py-2 md:py-3 bg-white text-slate-950 text-xs md:text-sm font-bold rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Get Started
              </motion.button>
            </Link>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-300 bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: "spring" as const,
                  stiffness: 250,
                  damping: 30,
                  mass: 1
                }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-slate-900/90 backdrop-blur-2xl z-50 lg:hidden border-l border-white/5 p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2 rounded-xl text-white">
                      <ListTodo size={20} />
                    </div>
                    <span className="text-xl font-black text-white">PLANIT</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/5 text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="h-px bg-white/5 my-4" />
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold border border-white/5">
                      Log In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-4 rounded-2xl bg-white text-slate-950 font-bold">
                      Get Started Free
                    </button>
                  </Link>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                  <p className="text-sm text-slate-500 font-medium">© 2024 Planit Productivity.</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 md:pt-32 pb-16 px-4 md:px-6 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-8 md:space-y-12"
          >
            <motion.div
              variants={itemVariants}
              className="px-4 md:px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
              <span className="text-indigo-300 text-[11px] md:text-[13px] font-bold tracking-wider uppercase">Achieve your goals faster</span>
            </motion.div>

            <motion.div variants={itemVariants} animate={floatAnimation} className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight md:leading-[1.1] max-w-4xl mx-auto tracking-tight">
                <span className="block">Organize your</span>
                <span className="bg-gradient-to-r from-indigo-400 via-white to-cyan-400 bg-clip-text text-transparent font-black">day like a pro.</span>
              </h1>

              <p className="text-sm md:text-xl text-slate-400 max-w-xl mx-auto font-medium leading-relaxed opacity-90 px-2">
                The intelligent task manager designed to keep you focused
                and productive, without the clutter.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5 pt-2 w-full sm:w-auto px-2"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, filter: "brightness(1.1)", y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20,
                    mass: 0.5
                  }}
                  className="w-full sm:w-auto group px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.3)]"
                >
                  Get Started Free
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)", y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20,
                    mass: 0.5
                  }}
                  className="w-full sm:w-auto px-4 md:px-6 py-3 md:py-4 bg-white/5 text-white border border-white/10 rounded-xl md:rounded-2xl font-medium text-xs sm:text-sm md:text-base backdrop-blur-xl"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            <DashboardPreview />
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureItem
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Quick task creation and seamless workflow designed for peak performance. Zero lag, pure focus."
              delay={0.1}
            />
            <FeatureItem
              icon={<Shield className="w-8 h-8" />}
              title="Identity Proof"
              description="Your data is your business. We provide end-to-end encryption to keep your tasks private."
              delay={0.2}
            />
            <FeatureItem
              icon={<BarChart3 className="w-8 h-8" />}
              title="Deep Analytics"
              description="Visualize your productivity with beautiful, high-fidelity charts and automated progress tracking."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 relative overflow-hidden bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              type: "spring" as const,
              stiffness: 70,
              damping: 15
            }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Built for Achievers.</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto font-medium">Join 50,000+ individuals who have transformed their workflow with Planit.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            <StatItem label="Daily Users" value="50k+" />
            <StatItem label="Tasks Done" value="1.2M+" />
            <StatItem label="Satisfaction" value="99.9%" />
            <StatItem label="App Rating" value="4.9/5" />
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-[#01040f]">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="bg-white p-2 rounded-xl shadow-lg shadow-white/10">
                <ListTodo className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-black text-lg md:text-xl text-white tracking-tight uppercase">PLANIT</span>
            </div>
            <p className="text-slate-500 text-[10px] md:text-xs font-bold tracking-wide uppercase">ELEVATE YOUR OUTPUT</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl mt-8 flex flex-col items-center">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-3 md:mb-4 tracking-wide uppercase">CONNECT WITH US</p>
          <div className="flex gap-3 md:gap-4">
            <Link
              href="https://www.linkedin.com/in/rimza-asad-206b332b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3 md:w-4 h-3 md:h-4 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="https://github.com/RIMZAASAD"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
              aria-label="GitHub"
            >
              <Github className="w-3 md:w-4 h-3 md:h-4 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="https://stackoverflow.com/users/30621843/rimza-asad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
              aria-label="Stack Overflow"
            >
              <Globe className="w-3 md:w-4 h-3 md:h-4 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-white/5 text-[7px] md:text-[9px] text-slate-700 font-bold tracking-wide uppercase">
          &copy; {new Date().getFullYear()} Planit Labs Inc. Global. All rights reserved.
        </div>
      </footer>
    </div>
  );
}