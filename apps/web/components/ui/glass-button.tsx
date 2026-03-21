"use client";

import { motion } from "framer-motion";

export const GlassButton = ({
  children,
  className = "",
  primary = false,
  type = "button",
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  primary?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      relative group px-6 py-3 rounded-full font-medium tracking-wide
      transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
      ${
        primary
          ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
          : "glass hover:bg-white/10"
      }
      ${className}
    `}
  >
    {primary && (
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
    )}
    <span className="relative flex items-center justify-center gap-2">
      {children}
    </span>
  </motion.button>
);
