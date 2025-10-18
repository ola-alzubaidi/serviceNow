import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceNowClient } from '@/lib/servicenow'

// GET single dashboard
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session as any).basicAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = createServiceNowClient((session as any).basicAuth)
    const dashboards = await client.getTableData('pa_dashboards', {
      sysparm_query: `sys_id=${params.id}`,
      sysparm_limit: 1,
    })

    if (dashboards.length === 0) {
      return NextResponse.json(
        { error: 'Dashboard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ dashboard: dashboards[0] })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard' },
      { status: 500 }
    )
  }
}

// PATCH - Update dashboard
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session as any).basicAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const client = createServiceNowClient((session as any).basicAuth)

    const dashboard = await client.updateRecord('pa_dashboards', params.id, body)

    return NextResponse.json({ dashboard })
  } catch (error) {
    console.error('Error updating dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to update dashboard' },
      { status: 500 }
    )
  }
}

// DELETE dashboard
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session as any).basicAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = createServiceNowClient((session as any).basicAuth)
    await client.deleteRecord('pa_dashboards', params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to delete dashboard' },
      { status: 500 }
    )
  }
}

