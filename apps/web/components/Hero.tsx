import { ArrowRight, CheckCircle2 } from "lucide-react";
import React from "react";
import { GlassButton } from "./ui/glass-button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-24">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/30 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Interview Preparation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
            Practice Interviews
            <br />
            <span className="text-gradient">Powered by AI.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Practice with an AI interviewer that listens, responds, and provides
            expert-level feedback. Build confidence, sharpen your skills, and
            land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <GlassButton
                primary
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8"
              >
                Start Practicing Free <ArrowRight className="w-5 h-5 ml-1" />
              </GlassButton>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <GlassButton className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                Sign In
              </GlassButton>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> 3 Free Tokens
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> No CC Required
            </span>
          </div>
        </motion.div>

        {/* Right Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 w-full max-w-125 lg:max-w-none relative"
        >
          <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-purple-500/20 blur-2xl rounded-[3rem] -z-10" />
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/hero-mockup.png"
              alt="AI Interview Session Preview"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl"
              priority
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden sm:flex absolute -left-6 top-1/4 glass px-3 sm:px-4 py-2 sm:py-3 rounded-xl items-center gap-2 sm:gap-3 shadow-lg"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm sm:text-base">
                  94
                </span>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Communication</p>
                <p className="text-green-400">+12% improvement</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
