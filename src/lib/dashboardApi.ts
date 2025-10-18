import { DashboardConfig } from '@/types/dashboard'

// Fetch all dashboards from ServiceNow
export async function fetchDashboards(): Promise<DashboardConfig[]> {
  try {
    const response = await fetch('/api/dashboards')
    if (!response.ok) {
      throw new Error('Failed to fetch dashboards')
    }
    const data = await response.json()
    
    // Transform ServiceNow dashboard format to our format
    return data.dashboards.map((d: any) => ({
      id: d.sys_id,
      name: d.name,
      description: d.description || '',
      type: d.type || 'custom',
      createdAt: d.sys_created_on,
      updatedAt: d.sys_updated_on,
      settings: {
        limit: 50,
        layout: 'grid',
        filters: {},
        refreshInterval: d.refresh_interval ? parseInt(d.refresh_interval) : 0,
      }
    }))
  } catch (error) {
    console.error('Error fetching dashboards:', error)
    return []
  }
}

// Create a new dashboard in ServiceNow
export async function createDashboardApi(data: {
  name: string
  description?: string
  type?: string
}): Promise<DashboardConfig | null> {
  try {
    const response = await fetch('/api/dashboards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create dashboard')
    }

    const result = await response.json()
    
    return {
      id: result.dashboard.sys_id,
      name: result.dashboard.name,
      description: result.dashboard.description || '',
      type: result.dashboard.type || 'custom',
      createdAt: result.dashboard.sys_created_on,
      updatedAt: result.dashboard.sys_updated_on,
      settings: {
        limit: 50,
        layout: 'grid',
        filters: {},
      }
    }
  } catch (error) {
    console.error('Error creating dashboard:', error)
    return null
  }
}

// Update a dashboard in ServiceNow
export async function updateDashboardApi(
  id: string,
  updates: Partial<DashboardConfig>
): Promise<boolean> {
  try {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updates.name,
        description: updates.description,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Error updating dashboard:', error)
    return false
  }
}

// Delete a dashboard from ServiceNow
export async function deleteDashboardApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'DELETE',
    })

    return response.ok
  } catch (error) {
    console.error('Error deleting dashboard:', error)
    return false
  }
}

