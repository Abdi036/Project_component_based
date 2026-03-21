/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, CheckCircle2, Github } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { GlassButton } from "@/components/ui/glass-button";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const password = form.watch("password");
  const passwordStrength = getPasswordStrength(password);

  function getPasswordStrength(pw: string): {
    score: number;
    label: string;
    color: string;
  } {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-400" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-400" };
    if (score <= 4)
      return { score: 4, label: "Strong", color: "bg-emerald-400" };
    return { score: 5, label: "Excellent", color: "bg-emerald-500" };
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.post("/auth/register", values);
      setSuccess(true);
      toast.success("Account created! Please verify your email.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-primary">
              {form.getValues("email")}
            </span>
            . Please verify your email to continue.
          </p>
        </div>
        <Link href="/login" className="w-full">
          <GlassButton className="w-full py-3">Go to login</GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Create account
        </h1>
        <p className="text-muted-foreground">
          Start your journey to interview success
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium pl-1">Full name</label>
          <input
            type="text"
            placeholder="abdi kumela"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary/50 transition-colors"
            {...form.register("name")}
            disabled={isLoading}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-400 pl-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium pl-1">Email address</label>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary/50 transition-colors"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-400 pl-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium pl-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base outline-none focus:border-primary/50 transition-colors"
              {...form.register("password")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-400 pl-1">
              {form.formState.errors.password.message}
            </p>
          )}

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.score
                        ? passwordStrength.color
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength:{" "}
                <span className="font-medium">{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        <GlassButton
          primary
          type="submit"
          className="w-full py-3.5 mt-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create account
        </GlassButton>

        <p className="text-[10px] text-center text-muted-foreground px-4">
          By clicking &quot;Create account&quot;, you agree to our Terms of
          Service and Privacy Policy.
        </p>
      </form>

      {/* Social login divider */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="glass flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button className="glass flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
