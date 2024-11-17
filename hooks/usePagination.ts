
// hooks/usePagination.ts
import { useMemo } from 'react'
import { PaginationInfo } from '@/types'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

export function usePagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage 
}: UsePaginationProps): PaginationInfo {
  const pageCount = Math.ceil(totalItems / itemsPerPage)

  return useMemo(() => ({
    currentPage: Math.min(currentPage, pageCount),
    pageCount,
    totalItems,
    itemsPerPage
  }), [currentPage, pageCount, totalItems, itemsPerPage])
}