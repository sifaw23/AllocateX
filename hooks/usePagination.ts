// hooks/usePagination.ts
import { useMemo } from 'react'
import type { PaginationInfo, UsePaginationReturn } from '@/types'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onChange?: (page: number) => void
}

export function usePagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage,
  onChange 
}: UsePaginationProps): UsePaginationReturn {
  const pageCount = Math.ceil(totalItems / itemsPerPage)

  const validCurrentPage = useMemo(() => 
    Math.min(Math.max(1, currentPage), Math.max(1, pageCount))
  , [currentPage, pageCount])

  const setPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), pageCount)
    if (validPage !== currentPage && onChange) {
      onChange(validPage)
    }
  }

  const nextPage = () => {
    if (canNextPage) {
      setPage(validCurrentPage + 1)
    }
  }

  const prevPage = () => {
    if (canPrevPage) {
      setPage(validCurrentPage - 1)
    }
  }

  const canNextPage = useMemo(() => 
    validCurrentPage < pageCount
  , [validCurrentPage, pageCount])

  const canPrevPage = useMemo(() => 
    validCurrentPage > 1
  , [validCurrentPage])

  return useMemo(() => ({
    currentPage: validCurrentPage,
    pageCount,
    totalItems,
    itemsPerPage,
    setPage,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage
  }), [
    validCurrentPage,
    pageCount,
    totalItems,
    itemsPerPage,
    canNextPage,
    canPrevPage
  ])
}