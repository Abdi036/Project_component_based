"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 px-4 sm:px-6 py-5 sm:py-8">
        <Link
          href="/"
          className="flex items-center gap-2 w-fit mx-auto lg:mx-0"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="font-bold text-lg sm:text-xl tracking-tight">
            Code<span className="text-primary">Prep</span>
          </span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
