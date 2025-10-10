"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dashboard } from "@/components/Dashboard"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    console.log('🏠 Home page - Auth status:', { 
      status, 
      hasSession: !!session, 
      hasBasicAuth: !!(session as any)?.basicAuth,
      sessionKeys: session ? Object.keys(session) : []
    })
    
    if (status === "authenticated" && (session as any)?.basicAuth) {
      console.log('✅ Authenticated with Basic Auth, redirecting to /ritms')
      router.push("/ritms")
    } else if (status === "authenticated") {
      console.log('⚠️ Authenticated but no Basic Auth found')
    } else if (status === "unauthenticated") {
      console.log('❌ Not authenticated')
    }
  }, [session, status, router, mounted])

  // Show loading while checking authentication or before mounting
  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show dashboard for unauthenticated users (sign-in page)
  return <Dashboard />;
}
