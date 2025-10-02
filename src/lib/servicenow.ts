import axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface ServiceNowConfig {
  instanceUrl: string
  accessToken: string
}

export interface ServiceNowRecord {
  sys_id: string
  number?: string
  short_description?: string
  description?: string
  state?: string
  priority?: string
  created_on?: string
  updated_on?: string
  [key: string]: unknown
}

export interface ServiceNowResponse<T = unknown> {
  result: T[]
}

export class ServiceNowClient {
  private client: AxiosInstance
  private config: ServiceNowConfig

  constructor(config: ServiceNowConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: `${config.instanceUrl}/api/now`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.accessToken}`,
      },
    })
  }

  // Get incidents
  async getIncidents(params?: Record<string, unknown> & {
    sysparm_limit?: number
    sysparm_offset?: number
    sysparm_query?: string
    sysparm_fields?: string
  }): Promise<ServiceNowRecord[]> {
    try {
      const response: AxiosResponse<ServiceNowResponse<ServiceNowRecord>> = 
        await this.client.get('/table/incident', { params })
      return response.data.result
    } catch (error) {
      console.error('Error fetching incidents:', error)
      throw error
    }
  }

  // Get users
  async getUsers(params?: {
    sysparm_limit?: number
    sysparm_offset?: number
    sysparm_query?: string
    sysparm_fields?: string
  }): Promise<ServiceNowRecord[]> {
    try {
      const response: AxiosResponse<ServiceNowResponse<ServiceNowRecord>> = 
        await this.client.get('/table/sys_user', { params })
      return response.data.result
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // Get change requests
  async getChangeRequests(params?: {
    sysparm_limit?: number
    sysparm_offset?: number
    sysparm_query?: string
    sysparm_fields?: string
  }): Promise<ServiceNowRecord[]> {
    try {
      const response: AxiosResponse<ServiceNowResponse<ServiceNowRecord>> = 
        await this.client.get('/table/change_request', { params })
      return response.data.result
    } catch (error) {
      console.error('Error fetching change requests:', error)
      throw error
    }
  }

  // Get any table data
  async getTableData(tableName: string, params?: {
    sysparm_limit?: number
    sysparm_offset?: number
    sysparm_query?: string
    sysparm_fields?: string
  }): Promise<ServiceNowRecord[]> {
    try {
      const response: AxiosResponse<ServiceNowResponse<ServiceNowRecord>> = 
        await this.client.get(`/table/${tableName}`, { params })
      return response.data.result
    } catch (error) {
      console.error(`Error fetching ${tableName} data:`, error)
      throw error
    }
  }

  // Create a record
  async createRecord(tableName: string, data: Partial<ServiceNowRecord>): Promise<ServiceNowRecord> {
    try {
      const response: AxiosResponse<{ result: ServiceNowRecord }> = 
        await this.client.post(`/table/${tableName}`, data)
      return response.data.result
    } catch (error) {
      console.error(`Error creating ${tableName} record:`, error)
      throw error
    }
  }

  // Update a record
  async updateRecord(tableName: string, sysId: string, data: Partial<ServiceNowRecord>): Promise<ServiceNowRecord> {
    try {
      const response: AxiosResponse<{ result: ServiceNowRecord }> = 
        await this.client.patch(`/table/${tableName}/${sysId}`, data)
      return response.data.result
    } catch (error) {
      console.error(`Error updating ${tableName} record:`, error)
      throw error
    }
  }

  // Delete a record
  async deleteRecord(tableName: string, sysId: string): Promise<void> {
    try {
      await this.client.delete(`/table/${tableName}/${sysId}`)
    } catch (error) {
      console.error(`Error deleting ${tableName} record:`, error)
      throw error
    }
  }

  // Get user profile
  async getUserProfile(): Promise<ServiceNowRecord> {
    try {
      const response: AxiosResponse<{ result: ServiceNowRecord }> = 
        await this.client.get('/now/user/profile')
      return response.data.result
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }
}

// Utility function to create ServiceNow client from session
export function createServiceNowClient(accessToken: string): ServiceNowClient {
  const instanceUrl = process.env.SERVICENOW_INSTANCE_URL!
  
  if (!instanceUrl) {
    throw new Error('SERVICENOW_INSTANCE_URL environment variable is not set')
  }

  return new ServiceNowClient({
    instanceUrl,
    accessToken,
  })
}
