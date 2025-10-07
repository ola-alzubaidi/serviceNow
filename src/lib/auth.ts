import NextAuth from "next-auth"
import { type JWT } from "next-auth/jwt"

// ServiceNow Credentials Provider using Basic Auth
const ServiceNowProvider = {
  id: "servicenow",
  name: "ServiceNow",
  type: "credentials" as const,
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials: Record<string, string> | undefined) {
    if (!credentials?.username || !credentials?.password) {
      return null
    }

    try {
      console.log('🔐 Attempting ServiceNow authentication with Basic Auth...')
      console.log('📋 Request details:', {
        url: `${process.env.SERVICENOW_INSTANCE_URL}/api/now/table/sys_user`,
        username: credentials.username,
        hasPassword: !!credentials.password
      })
      
      // Create Basic Auth header
      const basicAuth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')
      
      // Test authentication by fetching user info directly
      const userResponse = await fetch(`${process.env.SERVICENOW_INSTANCE_URL}/api/now/table/sys_user?sysparm_query=user_name=${credentials.username}&sysparm_fields=sys_id,user_name,email,first_name,last_name`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Accept': 'application/json',
        },
      })

      if (!userResponse.ok) {
        console.error('❌ Basic Auth request failed:', {
          status: userResponse.status,
          statusText: userResponse.statusText
        })
        return null
      }

      const userData = await userResponse.json()
      const user = userData.result?.[0]

      if (!user) {
        console.error('❌ No user found')
        return null
      }

      console.log('✅ User authenticated with Basic Auth:', user.user_name)

      return {
        id: user.sys_id,
        name: user.user_name,
        email: user.email || `${user.user_name}@servicenow.com`,
        // Store Basic Auth for API calls
        basicAuth: basicAuth,
        username: credentials.username,
      }
    } catch (error) {
      console.error('❌ Basic Auth error:', error)
      return null
    }
  },
}

export const authOptions = {
  providers: [ServiceNowProvider],
  logger: {
    error: (code: string, metadata: any) => {
      console.error('NextAuth Error:', code, metadata)
    },
    warn: (code: string) => {
      console.warn('NextAuth Warning:', code)
    },
    debug: (code: string, metadata: any) => {
      console.log('NextAuth Debug:', code, metadata)
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('🔀 Redirect callback:', { url, baseUrl })
      // If redirecting to baseUrl or a relative path, redirect to /ritms
      if (url.startsWith(baseUrl)) return `${baseUrl}/ritms`
      // If redirecting to external URL, allow it
      else if (url.startsWith("/")) return `${baseUrl}/ritms`
      return `${baseUrl}/ritms`
    },
          async jwt({ token, user }: { token: JWT; user: any }) {
            console.log('🔑 JWT callback:', { 
              hasUser: !!user, 
              userKeys: user ? Object.keys(user) : [],
              tokenKeys: Object.keys(token)
            })
            
            // Persist the Basic Auth credentials to the token right after signin
            if (user) {
              console.log('💾 Storing Basic Auth data in token')
              token.basicAuth = user.basicAuth
              token.username = user.username
              console.log('✅ Token updated with Basic Auth:', !!token.basicAuth)
            }

            return token
          },
    async session({ session, token }: { session: any; token: JWT }) {
      console.log('👤 Session callback:', { 
        hasToken: !!token,
        tokenKeys: Object.keys(token),
        sessionKeys: Object.keys(session)
      })
      
      // Send Basic Auth properties to the client
      session.basicAuth = token.basicAuth
      session.username = token.username
      session.error = token.error
      console.log('✅ Session updated with Basic Auth:', !!session.basicAuth)
      return session
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      console.log('🔐 SignIn callback:', { 
        hasUser: !!user, 
        hasAccount: !!account, 
        hasProfile: !!profile,
        userKeys: user ? Object.keys(user) : [],
        accountKeys: account ? Object.keys(account) : [],
        profileKeys: profile ? Object.keys(profile) : []
      })
      return true
    },
  },
  session: {
    strategy: "jwt" as const,
  },
}
