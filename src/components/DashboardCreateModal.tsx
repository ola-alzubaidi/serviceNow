"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard, 
  Settings, 
  Filter,
  Sparkles
} from 'lucide-react'
import { createDashboard, updateDashboard } from '@/lib/dashboardStorage'
import { DashboardConfig } from '@/types/dashboard'

interface DashboardCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (dashboard: DashboardConfig) => void
  editDashboard?: DashboardConfig | null
}

export function DashboardCreateModal({ 
  open, 
  onOpenChange, 
  onSuccess,
  editDashboard 
}: DashboardCreateModalProps) {
  const [formData, setFormData] = useState({
    name: editDashboard?.name || '',
    description: editDashboard?.description || '',
    type: editDashboard?.type || 'ritms' as 'ritms' | 'incidents' | 'users' | 'custom',
    limit: editDashboard?.settings.limit || 50,
    layout: editDashboard?.settings.layout || 'grid' as 'grid' | 'list' | 'table',
    refreshInterval: editDashboard?.settings.refreshInterval || 0,
    filters: {
      state: '',
      priority: '',
      assignedTo: '',
      createdAfter: '',
    }
  })

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (!formData.name.trim()) {
        setError('Dashboard name is required')
        return
      }

      if (editDashboard) {
        // Update existing dashboard
        updateDashboard(editDashboard.id, {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          settings: {
            limit: formData.limit,
            layout: formData.layout,
            refreshInterval: formData.refreshInterval,
            filters: formData.filters,
          }
        })
        onSuccess(editDashboard)
      } else {
        // Create new dashboard
        const newDashboard = createDashboard({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          settings: {
            limit: formData.limit,
            layout: formData.layout,
            refreshInterval: formData.refreshInterval,
            filters: formData.filters,
          }
        })
        onSuccess(newDashboard)
      }

      // Reset form and close
      resetForm()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save dashboard')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'ritms',
      limit: 50,
      layout: 'grid',
      refreshInterval: 0,
      filters: {
        state: '',
        priority: '',
        assignedTo: '',
        createdAfter: '',
      }
    })
    setError(null)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-blue-50 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
            </div>
            {editDashboard ? 'Edit Dashboard' : 'Create New Dashboard'}
          </DialogTitle>
          <DialogDescription>
            Configure your dashboard settings, filters, and display options
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Basic Information
            </div>
            <Separator />
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Dashboard Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., My Test Dashboard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Give your dashboard a descriptive name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="What is this dashboard used for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Optional description to help identify this dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Configuration */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Settings className="h-4 w-4 text-blue-600" />
              Dashboard Configuration
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Data Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="type"
                  className="w-full h-10 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  required
                >
                  <option value="ritms">Request Items (RITMs)</option>
                  <option value="incidents">Incidents</option>
                  <option value="users">Users</option>
                  <option value="custom">Custom Table</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout" className="text-sm font-medium">
                  Display Layout
                </Label>
                <select
                  id="layout"
                  className="w-full h-10 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.layout}
                  onChange={(e) => setFormData({ ...formData, layout: e.target.value as any })}
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                  <option value="table">Table View</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit" className="text-sm font-medium">
                  Items per Page
                </Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 50 })}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum: 100 items
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refresh" className="text-sm font-medium">
                  Auto-Refresh (seconds)
                </Label>
                <Input
                  id="refresh"
                  type="number"
                  min="0"
                  max="300"
                  value={formData.refreshInterval}
                  onChange={(e) => setFormData({ ...formData, refreshInterval: parseInt(e.target.value) || 0 })}
                  className="h-10"
                  placeholder="0 = Disabled"
                />
                <p className="text-xs text-muted-foreground">
                  0 to disable auto-refresh
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="h-4 w-4 text-blue-600" />
              Filters (Optional)
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-state" className="text-sm font-medium">
                  State Filter
                </Label>
                <select
                  id="filter-state"
                  className="w-full h-10 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.filters.state}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    filters: { ...formData.filters, state: e.target.value }
                  })}
                >
                  <option value="">All States</option>
                  <option value="1">New</option>
                  <option value="2">In Progress</option>
                  <option value="3">On Hold</option>
                  <option value="4">Resolved</option>
                  <option value="6">Closed</option>
                  <option value="7">Cancelled</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-priority" className="text-sm font-medium">
                  Priority Filter
                </Label>
                <select
                  id="filter-priority"
                  className="w-full h-10 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.filters.priority}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    filters: { ...formData.filters, priority: e.target.value }
                  })}
                >
                  <option value="">All Priorities</option>
                  <option value="1">Critical</option>
                  <option value="2">High</option>
                  <option value="3">Medium</option>
                  <option value="4">Low</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-assigned" className="text-sm font-medium">
                  Assigned To
                </Label>
                <Input
                  id="filter-assigned"
                  placeholder="Username or User ID"
                  value={formData.filters.assignedTo}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    filters: { ...formData.filters, assignedTo: e.target.value }
                  })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-date" className="text-sm font-medium">
                  Created After
                </Label>
                <Input
                  id="filter-date"
                  type="date"
                  value={formData.filters.createdAfter}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    filters: { ...formData.filters, createdAfter: e.target.value }
                  })}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editDashboard ? 'Update Dashboard' : 'Create Dashboard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

