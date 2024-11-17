// components/address/TableActions.tsx
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { downloadExcel, downloadCSV, downloadJSON } from '@/utils/fileHandlers'
import { AddressData } from '@/types'

export interface TableActionsProps {
  selectedCount: number
  totalCount: number
  searchTerm: string
  onSearchChange: (term: string) => void
  onDelete: () => void
  onExport: (format: 'excel' | 'csv' | 'json') => void
  data?: AddressData[]
}

export default function TableActions({
  selectedCount,
  totalCount,
  searchTerm,
  onSearchChange,
  onDelete,
  onExport,
  data = []
}: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const handleExport = (format: 'excel' | 'csv' | 'json') => {
    if (!data.length) return

    switch (format) {
      case 'excel':
        downloadExcel(data)
        break
      case 'csv':
        downloadCSV(data)
        break
      case 'json':
        downloadJSON(data)
        break
    }
    onExport(format)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Search addresses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          variant="secondary"
          onClick={() => handleExport('excel')}
          disabled={!data.length}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={selectedCount === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedCount})
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete {selectedCount} selected addresses?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete()
                  setShowDeleteDialog(false)
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
