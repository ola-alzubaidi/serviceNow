"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RequestItemCard } from "@/components/RequestItemCard"
import { ServiceNowRecord } from "@/lib/servicenow"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, LogOut } from "lucide-react"

export default function RITMsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ritms, setRitms] = useState<ServiceNowRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const fetchRITMs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ritms?limit=50')
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (mounted && (session as any)?.basicAuth) {
      fetchRITMs()
    }
  }, [session, status, mounted, router])

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Request Items (RITMs)
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome, {session?.user?.name || session?.user?.email}
              </p>
            </div>
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
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={fetchRITMs}
            disabled={loading}
            variant="default"
            size="default"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        {ritms.length > 0 && (
          <Alert className="mt-8 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700">
              Found {ritms.length} RITMs. Showing up to 50 request items from ServiceNow.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
