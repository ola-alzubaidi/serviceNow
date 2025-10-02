import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createServiceNowClient } from '@/lib/servicenow'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const query = searchParams.get('query') || ''
    const fields = searchParams.get('fields') || 'sys_id,user_name,first_name,last_name,email,active'

    const servicenowClient = createServiceNowClient((session as any).accessToken as string)
    
    const users = await servicenowClient.getUsers({
      sysparm_limit: parseInt(limit),
      sysparm_offset: parseInt(offset),
      sysparm_query: query,
      sysparm_fields: fields,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
