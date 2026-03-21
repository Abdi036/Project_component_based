"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Brain,
  BarChart3,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Target,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import Footer from "./Footer";
import Hero from "./Hero";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0 border-white/5 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="font-bold text-lg sm:text-xl tracking-tight">
              Code<span className="text-primary">Prep</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it Works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link href="/register">
              <GlassButton primary className="py-2 px-5 text-sm">
                Get Started Free
              </GlassButton>
            </Link>
          </div>
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-3 border-t border-white/10 mt-3">
                <a
                  href="#how-it-works"
                  className="block px-2 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <a
                  href="#features"
                  className="block px-2 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block px-2 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <GlassButton className="w-full py-2.5 text-sm">
                      Log in
                    </GlassButton>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <GlassButton primary className="w-full py-2.5 text-sm">
                      Get Started Free
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-24">
        {/* Hero Section */}
        <div>
          <Hero />
        </div>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24"
        >
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              From Setup to Offer in{" "}
              <span className="text-primary">4 Steps</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process gets you practicing in seconds.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

            {[
              {
                num: "01",
                title: "Create Your Profile",
                desc: "Sign up and tell us about your target role, experience, and goals.",
              },
              {
                num: "02",
                title: "Generate Questions",
                desc: "Our AI crafts personalized questions matching your job requirements.",
              },
              {
                num: "03",
                title: "Practice with AI",
                desc: "Have a realistic voice conversation with our AI-powered interviewer.",
              },
              {
                num: "04",
                title: "Get Feedback",
                desc: "Review detailed analytics, scores, and actionable tips to level up.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full glass border-primary/30 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  {step.num}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-62.5">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24"
        >
          <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
                Everything You Need
                <br />
                <span className="text-gradient">To Succeed.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Our AI-powered platform gives you all the tools to prepare,
                practice, and perform at your best.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Mic className="w-6 h-6 text-indigo-400" />,
                title: "AI Voice Interviews",
                desc: "Practice with a realistic AI interviewer that adapts to your responses in real-time.",
              },
              {
                icon: <Brain className="w-6 h-6 text-purple-400" />,
                title: "Smart Question Generation",
                desc: "Get tailored questions based on your role, experience level, and target company.",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
                title: "Detailed Feedback",
                desc: "Granular breakdown of your communication, technical accuracy, and confidence.",
              },
              {
                icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
                title: "Personalized Study Plans",
                desc: "AI-generated study plans that focus on your weak areas and learning goals.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-rose-400" />,
                title: "Track Improvement",
                desc: "Visualize your growth over time with historical scoring and trend analysis.",
              },
              {
                icon: <Target className="w-6 h-6 text-amber-400" />,
                title: "Role-Specific Questions",
                desc: "From Frontend Developer to Product Manager, practice questions tailored to your role.",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass-card p-5 sm:p-8 group hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
          <div className="text-center space-y-4 mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
              Built for{" "}
              <span className="text-gradient">Serious Candidates</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Designed to help ambitious individuals prepare smarter, practice
              better, and perform confidently in real interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Final Year Students",
                text: "Prepare for your first tech interviews with structured mock sessions, personalized study plans, and real-time AI feedback.",
              },
              {
                title: "Career Switchers",
                text: "Transition into tech confidently with guided practice, skill-gap insights, and interview simulations tailored to your goals.",
              },
              {
                title: "Ambitious Developers",
                text: "Level up your interview performance with advanced mock interviews, communication analysis, and realistic voice-based practice.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card p-5 sm:p-8"
              >
                <h3 className="font-semibold text-sm sm:text-base mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/10 rounded-full blur-[100px] -z-10" />

          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 text-sm">
              <span className="text-primary font-bold">1 Session</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-white">1 Token</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with 3 free tokens. Pay only for what you practice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">
                Starter Pack
              </h3>
              <div className="text-5xl font-bold mb-2">
                5
                <span className="text-2xl text-muted-foreground ml-1">
                  tokens
                </span>
              </div>
              <p className="text-2xl font-medium mb-8">250 Birr</p>
              <ul className="space-y-4 mb-8 text-sm text-muted-foreground w-full text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> 5
                  AI interview tokens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                  Access to interview generator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                  Basic session history
                </li>
              </ul>
              <Link href="/login" className="w-full mt-auto">
                <GlassButton className="w-full">Buy Tokens</GlassButton>
              </Link>
            </div>

            <div className="glass-card p-1 relative flex flex-col bg-linear-to-b from-primary/50 to-purple-500/10 shadow-2xl z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-xs font-bold rounded-full uppercase tracking-wider text-white shadow-lg">
                Best Value
              </div>
              <div className="glass rounded-xl p-6 sm:p-8 flex flex-col items-center text-center h-full border-none bg-background/90">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Pro Pack
                </h3>
                <div className="text-5xl sm:text-6xl font-bold mb-2">
                  10
                  <span className="text-2xl text-muted-foreground ml-1">
                    tokens
                  </span>
                </div>
                <p className="text-2xl font-medium mb-8">400 Birr</p>
                <ul className="space-y-4 mb-8 text-sm w-full text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                    10 AI interview tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                    Faster practice loops
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                    Save & revisit sessions
                  </li>
                </ul>
                <Link href="/login" className="w-full mt-auto">
                  <GlassButton primary className="w-full">
                    Buy Tokens
                  </GlassButton>
                </Link>
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">
                Growth Pack
              </h3>
              <div className="text-5xl font-bold mb-2">
                15
                <span className="text-2xl text-muted-foreground ml-1">
                  tokens
                </span>
              </div>
              <p className="text-2xl font-medium mb-8">600 Birr</p>
              <ul className="space-y-4 mb-8 text-sm text-muted-foreground w-full text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> 15
                  AI interview tokens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                  More attempts for harder topics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                  Study plan friendly
                </li>
              </ul>
              <Link href="/login" className="w-full mt-auto">
                <GlassButton className="w-full">Buy Tokens</GlassButton>
              </Link>
            </div>

            <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">
                Power Pack
              </h3>
              <div className="text-5xl font-bold mb-2">
                20
                <span className="text-2xl text-muted-foreground ml-1">
                  tokens
                </span>
              </div>
              <p className="text-2xl font-medium mb-8">800 Birr</p>
              <ul className="space-y-4 mb-8 text-sm text-muted-foreground w-full text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> 20
                  AI interview tokens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                  Deep practice for interview week
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                  Most popular for intensive prep
                </li>
              </ul>
              <Link href="/login" className="w-full mt-auto">
                <GlassButton className="w-full">Buy Tokens</GlassButton>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
          <div className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-600/20 mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50" />

            <div className="relative glass border-white/20 p-6 sm:p-12 md:p-20 text-center">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Your Next Interview Shouldn&apos;t Be
                <br />
                Your First Practice.
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of candidates who have landed their dream jobs
                using CodePrep.
              </p>
              <Link href="/register">
                <GlassButton
                  primary
                  className="text-base sm:text-xl px-6 sm:px-10 py-3 sm:py-4 shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]"
                >
                  Start Practicing Free
                </GlassButton>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground">
                Takes 30 seconds to sign up. 3 free tokens included.
              </p>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "AI-powered voice mock interviews",
              "Personalized question generation",
              "Detailed performance analytics",
              "Custom study plans",
              "Real-time feedback & scoring",
              "Support for all experience levels",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <div>
        <Footer />
      </div>
    </div>
  );
}
