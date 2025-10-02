"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { IncidentCard } from "./IncidentCard"
import { UserCard } from "./UserCard"
import { ServiceNowRecord } from "@/lib/servicenow"

export function Dashboard() {
  const { data: session, status } = useSession()
  const [incidents, setIncidents] = useState<ServiceNowRecord[]>([])
  const [users, setUsers] = useState<ServiceNowRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'incidents' | 'users'>('incidents')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'incidents') {
        const response = await fetch('/api/servicenow/incidents?limit=20')
        const data = await response.json()
        setIncidents(data.incidents || [])
      } else {
        const response = await fetch('/api/servicenow/users?limit=20')
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    if ((session as any)?.accessToken) {
      fetchData()
    }
  }, [session, fetchData])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              ServiceNow Integration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connect to your ServiceNow instance to manage incidents and users
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => signIn('servicenow')}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Sign in with ServiceNow
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ServiceNow Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('incidents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'incidents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Incidents
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === 'incidents' ? (
                incidents.length > 0 ? (
                  incidents.map((incident) => (
                    <IncidentCard key={incident.sys_id} incident={incident} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No incidents found</p>
                  </div>
                )
              ) : (
                users.length > 0 ? (
                  users.map((user) => (
                    <UserCard key={user.sys_id} user={user} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
