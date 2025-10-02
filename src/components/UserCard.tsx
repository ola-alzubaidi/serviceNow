"use client"

import { ServiceNowRecord } from "@/lib/servicenow"

interface UserCardProps {
  user: ServiceNowRecord
}

export function UserCard({ user }: UserCardProps) {
  const getActiveStatus = (active: string | boolean) => {
    const isActive = active === 'true' || active === true
    return {
      color: isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
      text: isActive ? 'Active' : 'Inactive'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const status = getActiveStatus(user.active as string | boolean)

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {((user.first_name as string)?.[0] || '') + ((user.last_name as string)?.[0] || '') || (user.user_name as string)?.[0] || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {(user.first_name as string) && (user.last_name as string) 
                  ? `${user.first_name} ${user.last_name}`
                  : (user.user_name as string) || 'Unknown User'
                }
              </h3>
              <p className="text-sm text-gray-500">
                {(user.user_name as string) || 'No username'}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Contact Information
          </h4>
          <div className="space-y-1">
            {(user.email as string) && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email as string}
              </div>
            )}
            {(user.phone as string) && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user.phone as string}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-900">Department</dt>
            <dd className="text-gray-600">
              {(user.department as string) || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Location</dt>
            <dd className="text-gray-600">
              {(user.location as string) || 'N/A'}
            </dd>
          </div>
        </div>

        {(user.last_login_time as string) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm">
              <dt className="font-medium text-gray-900">Last Login</dt>
              <dd className="text-gray-600">
                {formatDate((user.last_login_time as string) || '')}
              </dd>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              ID: {user.sys_id}
            </span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
