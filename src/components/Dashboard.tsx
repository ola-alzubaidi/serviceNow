"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { IncidentCard } from "./IncidentCard"
import { UserCard } from "./UserCard"
import { RequestItemCard } from "./RequestItemCard"
import { ServiceNowRecord } from "@/lib/servicenow"

export function Dashboard() {
  const { data: session, status } = useSession()
  const [incidents, setIncidents] = useState<ServiceNowRecord[]>([])
  const [users, setUsers] = useState<ServiceNowRecord[]>([])
  const [requestItems, setRequestItems] = useState<ServiceNowRecord[]>([])
  const [userProfile, setUserProfile] = useState<ServiceNowRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'incidents' | 'users' | 'request-items' | 'profile'>('profile')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      if (activeTab === 'incidents') {
        const response = await fetch('/api/servicenow/incidents?limit=20')
        if (!response.ok) {
          throw new Error(`Failed to fetch incidents: ${response.statusText}`)
        }
        const data = await response.json()
        setIncidents(data.incidents || [])
        setSuccess(`Successfully loaded ${data.incidents?.length || 0} incidents`)
      } else if (activeTab === 'users') {
        const response = await fetch('/api/servicenow/users?limit=20')
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`)
        }
        const data = await response.json()
        setUsers(data.users || [])
        setSuccess(`Successfully loaded ${data.users?.length || 0} users`)
      } else if (activeTab === 'request-items') {
        const response = await fetch('/api/servicenow/request-items?limit=20')
        if (!response.ok) {
          throw new Error(`Failed to fetch request items: ${response.statusText}`)
        }
        const data = await response.json()
        setRequestItems(data.requestItems || [])
        setSuccess(`Successfully loaded ${data.requestItems?.length || 0} request items`)
      } else if (activeTab === 'profile') {
        const response = await fetch('/api/servicenow/profile')
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`)
        }
        const data = await response.json()
        setUserProfile(data.profile || null)
        setSuccess('Successfully loaded user profile')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data')
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
            <div className="flex space-x-4">
              <a
                href="/ritms"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                View RITMs
              </a>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Profile
                </button>
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
                <button
                  onClick={() => setActiveTab('request-items')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'request-items'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Request Items
                </button>
              </nav>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>

        {/* Content */}
        <div className="mt-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{success}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <div className="max-w-2xl">
                  {userProfile ? (
                    <UserCard user={userProfile} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No profile data available</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'incidents' && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {incidents.length > 0 ? (
                    incidents.map((incident) => (
                      <IncidentCard key={incident.sys_id} incident={incident} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No incidents found</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'users' && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <UserCard key={user.sys_id} user={user} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'request-items' && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {requestItems.length > 0 ? (
                    requestItems.map((requestItem) => (
                      <RequestItemCard key={requestItem.sys_id} requestItem={requestItem} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No request items found</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
