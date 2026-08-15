"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSignInMutation } from "@/redux/api/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken } from "@/redux/features/auth/authSlice";
import { setAccessTokenInCookie, setRoleInCookie } from "@/lib/cookies";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Read search params
  const emailParam = searchParams.get("email") || "";
  const isActivated = searchParams.get("activated") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Client-side validation state
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [signIn, { isLoading, error: apiError }] = useSignInMutation();

  // Prefill email if present in query params on mount
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
    if (isActivated) {
      setSuccessMessage(
        "Your account has been activated successfully. Please log in to continue."
      );
    }
  }, [emailParam, isActivated]);

  const handleValidation = () => {
    if (!email) {
      setValidationError("Email is required.");
      return false;
    }
    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setValidationError("Password is required.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const response = await signIn({
        email,
        password,
      }).unwrap();

      if (response.success && response.data) {
        const { accessToken, user } = response.data;

        // 1. Dispatch access token to Redux
        dispatch(setAccessToken(accessToken));

        // 2. Set cookies for auth middleware and persistence
        setAccessTokenInCookie(accessToken);
        setRoleInCookie(user.role);

        // Clear prefill success message
        setSuccessMessage("");

        // 3. Redirect user based on role
        if (user.role === "resident") {
          router.push("/resident/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      // API error is handled in the UI
    }
  };

  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "";
    
    // RTK Query errors store their backend JSON payload in error.data
    const message = error.data?.message || "";
    
    return message || "Invalid email or password. Please try again.";
  };

  const currentApiErrorMsg = getFriendlyErrorMessage(apiError);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Branding & Header */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Welcome Back
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
            Access your society management dashboard
          </p>
        </div>

        {/* Success Banner (for post-activation login) */}
        {successMessage && (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-850 dark:bg-green-950/20 dark:text-green-400 border border-green-150">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <span className="font-semibold">Success:</span> {successMessage}
            </div>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Validation / API Error Banner */}
          {(validationError || currentApiErrorMsg) && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <span className="font-semibold">Error:</span>{" "}
                {validationError || currentApiErrorMsg}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-400"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600 dark:text-zinc-400">
            Need to activate your account?{" "}
          </span>
          <Link
            href="/accept-invitation"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Activate here
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
              Loading login form...
            </p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
