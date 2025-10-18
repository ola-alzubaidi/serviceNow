import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceNowClient } from '@/lib/servicenow'

// GET all dashboards
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session as any).basicAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = createServiceNowClient((session as any).basicAuth)

    // Fetch dashboards from pa_dashboards table
    const dashboards = await client.getTableData('pa_dashboards', {
      sysparm_fields: 'sys_id,name,description,type,roles,filter,refresh_interval,sys_created_on,sys_updated_on',
      sysparm_limit: 100,
    })

    return NextResponse.json({ 
      dashboards,
      count: dashboards.length 
    })
  } catch (error) {
    console.error('Error fetching dashboards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboards' },
      { status: 500 }
    )
  }
}

// POST - Create a new dashboard
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session as any).basicAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Dashboard name is required' },
        { status: 400 }
      )
    }

    const client = createServiceNowClient((session as any).basicAuth)

    // Create dashboard in pa_dashboards table
    const dashboard = await client.createRecord('pa_dashboards', {
      name,
      description: description || '',
      type: 'custom',
    })

    return NextResponse.json({ dashboard })
  } catch (error) {
    console.error('Error creating dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to create dashboard' },
      { status: 500 }
    )
  }
}

