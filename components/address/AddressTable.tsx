// components/address/AddressTable.tsx
'use client'

import React, { useCallback } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, Upload, Download, Trash2, Search } from 'lucide-react'
import { useAddressData } from '@/context/AddressContext'
import { useTableControls } from '@/hooks/useTableControls'
import { formatAmount } from '@/utils/formatters'
import { copyToClipboard } from '@/utils/clipboard'
import { useToast } from "@/components/ui/use-toast"
import type { AddressData } from '@/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { downloadExcel, downloadCSV, downloadJSON } from '@/utils/fileHandlers'

export default function AddressTable() {
  const { tableData, deleteAddresses } = useAddressData()
  const { 
    controls,
    updateControls,
    paginatedData,
    sortedAndFilteredData,
    pageCount 
  } = useTableControls(tableData)
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const handleSelectAll = useCallback(() => {
    const newSelected = controls.selectedAddresses.size === paginatedData.length
      ? new Set<string>()
      : new Set(paginatedData.map((item: AddressData) => item.address))
    updateControls({ selectedAddresses: newSelected })
  }, [controls.selectedAddresses.size, paginatedData, updateControls])

  const handleSelectAddress = useCallback((address: string) => {
    const newSelected = new Set(controls.selectedAddresses)
    if (newSelected.has(address)) {
      newSelected.delete(address)
    } else {
      newSelected.add(address)
    }
    updateControls({ selectedAddresses: newSelected })
  }, [controls.selectedAddresses, updateControls])

  const handleCopy = useCallback(async (address: string) => {
    const success = await copyToClipboard(address)
    toast({
      title: success ? "Address copied" : "Copy failed",
      description: success 
        ? "The address has been copied to your clipboard."
        : "Failed to copy the address. Please try again.",
      variant: success ? "default" : "destructive"
    })
  }, [toast])

  const handleDelete = useCallback(() => {
    const count = controls.selectedAddresses.size
    deleteAddresses(controls.selectedAddresses)
    toast({
      title: "Addresses deleted",
      description: `${count} ${count === 1 ? 'address has' : 'addresses have'} been removed.`,
    })
    updateControls({ selectedAddresses: new Set<string>() })
    setShowDeleteDialog(false)
  }, [controls.selectedAddresses, deleteAddresses, toast, updateControls])

  const handleExport = useCallback((format: 'excel' | 'csv' | 'json') => {
    try {
      switch (format) {
        case 'excel':
          downloadExcel(sortedAndFilteredData)
          break
        case 'csv':
          downloadCSV(sortedAndFilteredData)
          break
        case 'json':
          downloadJSON(sortedAndFilteredData)
          break
      }
      toast({
        title: "Export complete",
        description: `Data has been exported in ${format.toUpperCase()} format.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      })
    }
  }, [sortedAndFilteredData, toast])

  const handleSort = useCallback(() => {
    updateControls({ 
      sortOrder: controls.sortOrder === 'asc' ? 'desc' : 'asc' 
    })
  }, [controls.sortOrder, updateControls])

  const handlePageChange = useCallback((page: number) => {
    updateControls({ currentPage: page })
  }, [updateControls])

  if (!tableData || tableData.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-muted p-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No addresses added yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start by adding addresses using the input above or upload a file containing your address data
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search addresses..."
            value={controls.searchTerm}
            onChange={(e) => updateControls({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                JSON (.json)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={controls.selectedAddresses.size === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({controls.selectedAddresses.size})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete {controls.selectedAddresses.size} selected addresses?</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Checkbox
                          checked={paginatedData.length > 0 && controls.selectedAddresses.size === paginatedData.length}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all addresses"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select all visible addresses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="font-medium">Address</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={handleSort}
                  className="font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item: AddressData) => (
              <TableRow key={item.address}>
                <TableCell>
                  <Checkbox
                    checked={controls.selectedAddresses.has(item.address)}
                    onCheckedChange={() => handleSelectAddress(item.address)}
                    aria-label={`Select address ${item.address}`}
                  />
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-mono text-sm truncate max-w-[300px]">
                          {item.address}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.address}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="font-mono text-right">
                  {formatAmount(item.amount)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(item.address)}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, controls.currentPage - 1))}
              disabled={controls.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(pageCount, controls.currentPage + 1))}
              disabled={controls.currentPage === pageCount}
            >
              Next
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            Page {controls.currentPage} of {Math.max(1, pageCount)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Total addresses: {sortedAndFilteredData.length}
        </div>
      </div>
    </div>
  )
}