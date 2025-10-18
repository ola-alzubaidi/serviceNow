"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Edit, 
  Check,
  X,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import {
  getDashboards,
  createDashboard,
  deleteDashboard,
  updateDashboard,
  setActiveDashboard,
  DEFAULT_DASHBOARD
} from '@/lib/dashboardStorage'
import { DashboardConfig } from '@/types/dashboard'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DashboardSidebarProps {
  onDashboardChange?: (dashboard: DashboardConfig) => void
}

export function DashboardSidebar({ onDashboardChange }: DashboardSidebarProps) {
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([])
  const [activeDashboardId, setActiveDashboardIdState] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<{
    name: string
    description: string
    type: 'ritms' | 'incidents' | 'users' | 'custom'
    limit: number
    layout: 'grid' | 'list' | 'table'
  }>({
    name: '',
    description: '',
    type: 'ritms',
    limit: 50,
    layout: 'grid',
  })

  useEffect(() => {
    loadDashboards()
  }, [])

  const loadDashboards = () => {
    const store = getDashboards()
    setDashboards(store.dashboards)
    setActiveDashboardIdState(store.activeDashboardId)
  }

  const handleCreateDashboard = () => {
    try {
      setError(null)
      
      if (!formData.name.trim()) {
        setError('Dashboard name is required')
        return
      }

      const newDashboard = createDashboard({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        settings: {
          limit: formData.limit,
          layout: formData.layout,
          filters: {},
        }
      })

      loadDashboards()
      setShowCreateForm(false)
      resetForm()
      
      if (onDashboardChange) {
        onDashboardChange(newDashboard)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dashboard')
    }
  }

  const handleUpdateDashboard = (id: string) => {
    try {
      setError(null)
      
      if (!formData.name.trim()) {
        setError('Dashboard name is required')
        return
      }

      updateDashboard(id, {
        name: formData.name,
        description: formData.description,
        settings: {
          limit: formData.limit,
          layout: formData.layout,
        }
      })

      loadDashboards()
      setEditingId(null)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dashboard')
    }
  }

  const handleDeleteDashboard = (id: string) => {
    try {
      setError(null)
      if (window.confirm('Are you sure you want to delete this dashboard?')) {
        deleteDashboard(id)
        loadDashboards()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dashboard')
    }
  }

  const handleSetActive = (dashboard: DashboardConfig) => {
    setActiveDashboard(dashboard.id)
    setActiveDashboardIdState(dashboard.id)
    
    if (onDashboardChange) {
      onDashboardChange(dashboard)
    }
  }

  const startEdit = (dashboard: DashboardConfig) => {
    setEditingId(dashboard.id)
    setFormData({
      name: dashboard.name,
      description: dashboard.description || '',
      type: dashboard.type,
      limit: dashboard.settings.limit || 50,
      layout: dashboard.settings.layout || 'grid',
    })
    setShowCreateForm(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'ritms',
      limit: 50,
      layout: 'grid',
    })
  }

  return (
    <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 h-full flex flex-col transition-all duration-300 shadow-2xl ${
      isCollapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Dashboards</h2>
              <p className="text-xs text-slate-400">Manage & Switch</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hover:bg-slate-700/50 text-slate-300 hover:text-white ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          {/* Error Alert */}
          {error && (
            <div className="p-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Create Dashboard Button */}
          {!showCreateForm && !editingId && (
            <div className="p-4 border-b border-slate-700/50">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 border-0"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Dashboard
              </Button>
            </div>
          )}

          {/* Create/Edit Form */}
          {(showCreateForm || editingId) && (
            <div className="p-4 border-b border-slate-700/50 space-y-3 max-h-[400px] overflow-y-auto bg-slate-800/50">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-400"></div>
                {editingId ? 'Edit Dashboard' : 'Create Dashboard'}
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="sidebar-name" className="text-xs text-slate-300">Name</Label>
                <Input
                  id="sidebar-name"
                  placeholder="Dashboard name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sidebar-desc" className="text-xs text-slate-300">Description</Label>
                <Input
                  id="sidebar-desc"
                  placeholder="Optional"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sidebar-type" className="text-xs text-slate-300">Type</Label>
                <select
                  id="sidebar-type"
                  className="w-full border border-slate-600 rounded-md px-2 py-1 text-sm bg-slate-700/50 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="ritms">RITMs</option>
                  <option value="incidents">Incidents</option>
                  <option value="users">Users</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="sidebar-limit" className="text-xs text-slate-300">Limit</Label>
                  <Input
                    id="sidebar-limit"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 50 })}
                    className="h-8 text-sm bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sidebar-layout" className="text-xs text-slate-300">Layout</Label>
                  <select
                    id="sidebar-layout"
                    className="w-full border border-slate-600 rounded-md px-2 py-1 text-sm bg-slate-700/50 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.layout}
                    onChange={(e) => setFormData({ ...formData, layout: e.target.value as any })}
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                    <option value="table">Table</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingId(null)
                    resetForm()
                  }}
                  className="flex-1 h-8 text-xs bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => editingId ? handleUpdateDashboard(editingId) : handleCreateDashboard()}
                  className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          )}

          {/* Dashboard List */}
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 space-y-2">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className={`group relative rounded-xl transition-all duration-200 ${
                    activeDashboardId === dashboard.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <button
                    onClick={() => handleSetActive(dashboard)}
                    className="w-full text-left p-3 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`p-1.5 rounded-lg ${
                            activeDashboardId === dashboard.id
                              ? 'bg-white/20'
                              : 'bg-slate-700/50'
                          }`}>
                            <LayoutDashboard className="h-3.5 w-3.5 flex-shrink-0" />
                          </div>
                          <span className="font-semibold text-sm truncate">{dashboard.name}</span>
                        </div>
                        {dashboard.description && (
                          <p className="text-xs opacity-70 truncate ml-8">{dashboard.description}</p>
                        )}
                        <div className="flex gap-1.5 mt-2.5 ml-8">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide ${
                            activeDashboardId === dashboard.id
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-700/70 text-slate-300'
                          }`}>
                            {dashboard.type}
                          </span>
                          <span className={`text-[10px] px-2 py-1 rounded-md font-medium ${
                            activeDashboardId === dashboard.id
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-700/70 text-slate-300'
                          }`}>
                            {dashboard.settings.limit} items
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Action buttons - show on hover */}
                  {dashboard.id !== DEFAULT_DASHBOARD.id && activeDashboardId !== dashboard.id && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEdit(dashboard)
                        }}
                        className="h-7 w-7 p-0 bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteDashboard(dashboard.id)
                        }}
                        className="h-7 w-7 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Settings hint */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="p-1.5 bg-slate-700/50 rounded-md">
                  <Settings className="h-3 w-3" />
                </div>
                <span className="font-medium">{dashboards.length} dashboard{dashboards.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
          </div>
        </>
      )}

      {/* Collapsed state - show icons only */}
      {isCollapsed && (
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {dashboards.map((dashboard) => (
            <div key={dashboard.id} className="px-2">
              <button
                onClick={() => handleSetActive(dashboard)}
                className={`w-full p-3 flex justify-center transition-all duration-200 rounded-xl relative ${
                  activeDashboardId === dashboard.id
                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
                title={dashboard.name}
              >
                <LayoutDashboard className="h-5 w-5" />
                {activeDashboardId === dashboard.id && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-400 rounded-l-full"></div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

