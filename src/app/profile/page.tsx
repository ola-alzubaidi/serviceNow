"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

interface ServiceNowProfile {
  name: string;
  email: string;
  username: string;
  [key: string]: any;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ServiceNowProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/servicenow/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => setProfile(data.profile))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access Denied</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {error && <p className="text-red-600">{error}</p>}

        {profile && (
          <div className="bg-white shadow rounded-lg p-6 w-full max-w-md space-y-4">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Username:</strong> {profile.username}</p>

            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
