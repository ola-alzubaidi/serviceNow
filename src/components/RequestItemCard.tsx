"use client"

import { ServiceNowRecord } from "@/lib/servicenow"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface RequestItemCardProps {
  requestItem: ServiceNowRecord
}

export function RequestItemCard({ requestItem }: RequestItemCardProps) {
  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority?.toLowerCase()) {
      case '1':
      case 'critical':
        return 'destructive'
      case '2':
      case 'high':
        return 'default'
      case '3':
      case 'medium':
        return 'secondary'
      case '4':
      case 'low':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStateVariant = (state: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (state?.toLowerCase()) {
      case 'new':
        return 'default'
      case 'in progress':
      case 'assigned':
        return 'secondary'
      case 'resolved':
        return 'outline'
      case 'closed':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {String(requestItem.number || requestItem.sys_id)}
          </CardTitle>
          <div className="flex gap-2">
            {requestItem.priority && (
              <Badge variant={getPriorityVariant(String(requestItem.priority))}>
                P{String(requestItem.priority)}
              </Badge>
            )}
            {requestItem.state && (
              <Badge variant={getStateVariant(String(requestItem.state))}>
                {String(requestItem.state)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {String(requestItem.short_description || requestItem.description || 'No description available')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium">Created</dt>
            <dd className="text-muted-foreground">
              {formatDate(requestItem.created_on || '')}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Updated</dt>
            <dd className="text-muted-foreground">
              {formatDate(requestItem.updated_on || '')}
            </dd>
          </div>
        </div>

        {requestItem.requested_for != null && (
          <div>
            <h4 className="text-sm font-medium mb-1">Requested For</h4>
            <p className="text-sm text-muted-foreground">
              {(requestItem.requested_for as any)?.display_value || 
               (requestItem.requested_for as any)?.value || 
               String(requestItem.requested_for)}
            </p>
          </div>
        )}

        {requestItem.requested_by != null && (
          <div>
            <h4 className="text-sm font-medium mb-1">Requested By</h4>
            <p className="text-sm text-muted-foreground">
              {(requestItem.requested_by as any)?.display_value || 
               (requestItem.requested_by as any)?.value || 
               String(requestItem.requested_by)}
            </p>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex items-center justify-between pt-4">
        <span className="text-xs text-muted-foreground">
          ID: {requestItem.sys_id}
        </span>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
