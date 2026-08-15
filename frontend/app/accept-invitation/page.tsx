"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAcceptInvitationMutation } from "@/redux/api/auth/authApi";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function AcceptInvitationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Client-side validation state
  const [validationError, setValidationError] = useState("");

  const [acceptInvitation, { isLoading, error: apiError }] =
    useAcceptInvitationMutation();

  const handleValidation = () => {
    if (!token) {
      setValidationError("Invitation token is missing.");
      return false;
    }
    if (!password) {
      setValidationError("Password is required.");
      return false;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return false;
    }
    if (!confirmPassword) {
      setValidationError("Please confirm your password.");
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const response = await acceptInvitation({
        token: token!,
        password,
      }).unwrap();

      if (response.success) {
        // Extract the email returned by the backend
        const email = response.data.email;
        // Redirect to the login page with prefilled email and success flag
        router.push(
          `/login?email=${encodeURIComponent(email)}&activated=true`
        );
      }
    } catch (err: any) {
      // API error is handled in the UI through `apiError` or local catch
    }
  };

  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "";
    
    // RTK Query errors store their backend JSON payload in error.data
    const message = error.data?.message || "";
    
    if (message.includes("Invalid invitation")) {
      return "Sorry, this invitation link is invalid.";
    }
    if (message.includes("already been used")) {
      return "This invitation has already been used. Please log in to your account.";
    }
    if (message.includes("expired")) {
      return "This invitation has expired. Please contact your society administrator for a new invitation.";
    }
    if (message.includes("not found")) {
      return "User account not found. Please contact support.";
    }
    if (message.includes("already been activated")) {
      return "This account has already been activated. Please log in to your account.";
    }
    return message || "Failed to activate account. Please try again.";
  };

  // 1. Missing Token Handling
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Invalid Invitation Link
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
              This activation link is invalid because the security token is missing. Please check your invitation email or contact your society administrator.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/login"
              className="flex w-full justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentApiErrorMsg = getFriendlyErrorMessage(apiError);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Branding & Header */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Society Manager
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Activate Your Account
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
            Create a password to activate your resident account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
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
            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-400"
                  placeholder="At least 8 characters"
                  aria-invalid={!!validationError && !password}
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

            {/* Confirm Password input */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
              >
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-400"
                  placeholder="Repeat your password"
                  aria-invalid={!!validationError && password !== confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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
                  Activating...
                </>
              ) : (
                "Activate Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600 dark:text-zinc-400">
            Already activated?{" "}
          </span>
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
              Loading activation form...
            </p>
          </div>
        </div>
      }
    >
      <AcceptInvitationForm />
    </Suspense>
  );
}
