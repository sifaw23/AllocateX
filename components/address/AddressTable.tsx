// components/address/AddressTable.tsx
import React, { useCallback } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from 'lucide-react'
import { useAddressData } from '@/hooks/useAddressData'
import { useTableControls } from '@/hooks/useTableControls'
import TableActions from './TableActions'
import TablePagination from './TablePagination'
import { formatAmount } from '@/utils/formatters'
import { copyToClipboard } from '@/utils/clipboard'
import { useToast } from "@/components/ui/use-toast"
import type { Toast } from "@/components/ui/use-toast"
import type { AddressData } from '@/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    } as Toast)
  }, [toast])

  const handleDelete = useCallback(() => {
    const count = controls.selectedAddresses.size
    deleteAddresses(controls.selectedAddresses)
    toast({
      title: "Addresses deleted",
      description: `${count} ${count === 1 ? 'address has' : 'addresses have'} been removed.`,
    } as Toast)
    updateControls({ selectedAddresses: new Set<string>() })
  }, [controls.selectedAddresses, deleteAddresses, toast, updateControls])

  const handleExport = useCallback((format: 'excel' | 'csv' | 'json') => {
    toast({
      title: "Export complete",
      description: `Data has been exported in ${format.toUpperCase()} format.`,
    } as Toast)
  }, [toast])

  const handleSort = useCallback(() => {
    updateControls({ 
      sortOrder: controls.sortOrder === 'asc' ? 'desc' : 'asc' 
    })
  }, [controls.sortOrder, updateControls])

  if (tableData.length === 0) {
    return (
      <div className="text-center py-12 bg-background border rounded-md">
        <div className="space-y-3">
          <p className="text-muted-foreground font-medium">
            No addresses added yet
          </p>
          <p className="text-sm text-muted-foreground">
            Start by adding addresses using the input above or upload a file
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TableActions
        selectedCount={controls.selectedAddresses.size}
        totalCount={sortedAndFilteredData.length}
        searchTerm={controls.searchTerm}
        onSearchChange={(term: string) => updateControls({ searchTerm: term })}
        onDelete={handleDelete}
        onExport={handleExport}
        data={sortedAndFilteredData}
      />

      <div className="rounded-md border bg-background">
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
        <TablePagination
          currentPage={controls.currentPage}
          pageCount={pageCount}
          onPageChange={(page: number) => updateControls({ currentPage: page })}
          totalItems={sortedAndFilteredData.length}
        />

        <div className="text-sm text-muted-foreground">
          Total addresses: {sortedAndFilteredData.length}
        </div>
      </div>
    </div>
  )
}