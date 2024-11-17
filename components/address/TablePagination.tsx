// components/address/TablePagination.tsx
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface TablePaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  totalItems: number
}

export default function TablePagination({
  currentPage,
  pageCount,
  onPageChange,
  totalItems
}: TablePaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
              disabled={currentPage === pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-sm text-muted-foreground">
        Total: {totalItems} {totalItems === 1 ? 'entry' : 'entries'}
      </div>
    </div>
  )
}