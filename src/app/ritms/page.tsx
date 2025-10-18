"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RequestItemCard } from "@/components/RequestItemCard"
import { RequestItemTable } from "@/components/RequestItemTable"
import { ServiceNowRecord } from "@/lib/servicenow"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, LogOut, LayoutDashboard, LayoutGrid, Table2 } from "lucide-react"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { getActiveDashboard } from "@/lib/dashboardStorage"
import { DashboardConfig } from "@/types/dashboard"

export default function RITMsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ritms, setRitms] = useState<ServiceNowRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeDashboard, setActiveDashboard] = useState<DashboardConfig | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  const fetchRITMs = async (limit?: number) => {
    setLoading(true)
    setError(null)
    try {
      const itemLimit = limit || activeDashboard?.settings.limit || 50
      const response = await fetch(`/api/ritms?limit=${itemLimit}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch RITMs: ${response.statusText}`)
      }
      const data = await response.json()
      setRitms(data.ritms || [])
    } catch (error) {
      console.error('Error fetching RITMs:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching RITMs')
    } finally {
      setLoading(false)
    }
  }

  const handleDashboardChange = (dashboard: DashboardConfig) => {
    setActiveDashboard(dashboard)
    // Fetch data based on the new dashboard's settings
    if (dashboard.type === 'ritms') {
      fetchRITMs(dashboard.settings.limit)
    }
  }

  useEffect(() => {
    setMounted(true)
    // Load active dashboard on mount
    const dashboard = getActiveDashboard()
    if (dashboard) {
      setActiveDashboard(dashboard)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (mounted && (session as any)?.basicAuth) {
      fetchRITMs()
    }
  }, [session, status, mounted, router, activeDashboard])

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null // Redirect is handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                ServiceNow Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            {activeDashboard && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">{activeDashboard.name}</div>
                  {activeDashboard.description && (
                    <div className="text-xs text-muted-foreground">{activeDashboard.description}</div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('cards')}
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 ${viewMode === 'cards' ? 'shadow-sm' : ''}`}
                  title="Card View"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Cards
                </Button>
                <Button
                  onClick={() => setViewMode('table')}
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 ${viewMode === 'table' ? 'shadow-sm' : ''}`}
                  title="Table View"
                >
                  <Table2 className="h-4 w-4 mr-2" />
                  Table
                </Button>
              </div>
              
              <Button
                onClick={() => fetchRITMs()}
                disabled={loading}
                variant="outline"
                size="default"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                variant="outline"
                size="default"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <DashboardSidebar onDashboardChange={handleDashboardChange} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <RequestItemTable requestItems={ritms} />
                ) : (
                  <div className={`grid gap-6 ${
                    activeDashboard?.settings.layout === 'list' 
                      ? 'grid-cols-1' 
                      : activeDashboard?.settings.layout === 'table'
                      ? 'grid-cols-1'
                      : 'md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {ritms.length > 0 ? (
                      ritms.map((ritm) => (
                        <RequestItemCard key={ritm.sys_id} requestItem={ritm} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No RITMs found</p>
                      </div>
                    )}
                  </div>
                )}

                {ritms.length > 0 && viewMode === 'cards' && (
                  <Alert className="mt-8 bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-700">
                      Found {ritms.length} RITMs. Showing up to {activeDashboard?.settings.limit || 50} request items from ServiceNow.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
