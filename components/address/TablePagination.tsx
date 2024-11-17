// components/address/TablePagination.tsx
import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePagination } from '@/hooks/usePagination'
import type { PaginationProps } from '@/types'

export default function TablePagination({
  currentPage,
  pageCount,
  onPageChange,
  totalItems
}: PaginationProps) {
  const pagination = usePagination({
    totalItems,
    itemsPerPage: 10,
    currentPage,
    onChange: onPageChange
  })

  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => pagination.prevPage()}
          disabled={!pagination.canPrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => pagination.nextPage()}
          disabled={!pagination.canNextPage}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Page {pagination.currentPage} of {pagination.pageCount}
        </span>
        <span>
          ({totalItems} total items)
        </span>
      </div>
    </div>
  )
}