"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/features/auth/authSlice";
import { removeAccessToken } from "@/lib/cookies";
import { LogOut, User as UserIcon, Building, Mail, ShieldAlert, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Fetch current user details
  const { data: meData, isLoading, isError } = useGetMeQuery();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      // Even if backend fails, we should clear frontend session
    } finally {
      // Clear redux state
      dispatch(logoutAction());
      // Remove cookies
      removeAccessToken();
      // Redirect to login page
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Handle unauthorized or load failure
  if (isError || !meData?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md text-center rounded-2xl border border-slate-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
            You must be logged in to access this page. Please log in with your credentials.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                removeAccessToken();
                dispatch(logoutAction());
                router.push("/login");
              }}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 focus:outline-none dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user } = meData;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Top Navbar */}
      <nav className="border-b border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-900 dark:text-white">
                Society Manager (Admin/SuperAdmin)
              </span>
            </div>
            <div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <UserIcon className="h-8 w-8" />
                  </div>
                  <span
                    className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-white dark:ring-zinc-900"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="pt-1.5">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {user.name || "Administrator"}
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Administrative Control Panel ({user.role})
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* User Info Card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Profile Details
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Name: {user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Email: {user.email}</span>
                </div>
              </div>
            </div>

            {/* Role Card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                System Role
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                  <span>{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
