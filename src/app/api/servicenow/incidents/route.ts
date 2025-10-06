import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createServiceNowClient } from '@/lib/servicenow'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
          if (!(session as any)?.basicAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
          }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const query = searchParams.get('query') || ''
    const fields = searchParams.get('fields') || 'sys_id,number,short_description,state,priority,created_on,updated_on'

    const servicenowClient = createServiceNowClient((session as any).basicAuth as string)
    
    const incidents = await servicenowClient.getIncidents({
      sysparm_limit: parseInt(limit),
      sysparm_offset: parseInt(offset),
      sysparm_query: query,
      sysparm_fields: fields,
    })

    return NextResponse.json({ incidents })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}
