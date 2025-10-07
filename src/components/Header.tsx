"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ServiceNow App</h1>
          </div>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/ritms" className="text-blue-600 hover:underline">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-blue-600 hover:underline">
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
