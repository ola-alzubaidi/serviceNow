"use client"

import { ServiceNowRecord } from "@/lib/servicenow"

interface IncidentCardProps {
  incident: ServiceNowRecord
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case '1':
      case 'critical':
        return 'bg-red-100 text-red-800'
      case '2':
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case '3':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case '4':
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStateColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'in progress':
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {incident.number || incident.sys_id}
          </h3>
          <div className="flex space-x-2">
            {incident.priority && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                Priority {incident.priority}
              </span>
            )}
            {incident.state && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(incident.state)}`}>
                {incident.state}
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Description
          </h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {incident.short_description || incident.description || 'No description available'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-900">Created</dt>
            <dd className="text-gray-600">
              {formatDate(incident.created_on || '')}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Updated</dt>
            <dd className="text-gray-600">
              {formatDate(incident.updated_on || '')}
            </dd>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              ID: {incident.sys_id}
            </span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
