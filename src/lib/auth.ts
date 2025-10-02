import NextAuth from "next-auth"
import { type JWT } from "next-auth/jwt"

// ServiceNow OAuth Provider
const ServiceNowProvider = {
  id: "servicenow",
  name: "ServiceNow",
  type: "oauth" as const,
  authorization: {
    url: `${process.env.SERVICENOW_INSTANCE_URL}/oauth_auth.do`,
    params: {
      scope: "useraccount",
      response_type: "code",
    },
  },
  token: `${process.env.SERVICENOW_INSTANCE_URL}/oauth_token.do`,
  userinfo: `${process.env.SERVICENOW_INSTANCE_URL}/oauth_userinfo.do`,
  clientId: process.env.SERVICENOW_CLIENT_ID,
  clientSecret: process.env.SERVICENOW_CLIENT_SECRET,
  profile(profile: Record<string, unknown>) {
    return {
      id: profile.sys_id,
      name: profile.user_name,
      email: profile.email,
      image: null,
    }
  },
}

export const authOptions = {
  providers: [ServiceNowProvider],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Record<string, unknown> }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number)) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: Record<string, unknown>; token: JWT }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `${process.env.SERVICENOW_INSTANCE_URL}/oauth_token.do`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.SERVICENOW_CLIENT_ID!,
        client_secret: process.env.SERVICENOW_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log("Error refreshing access token", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const handlers = NextAuth(authOptions)

export { handlers }
