// hooks/useTableControls.ts
import { useState, useMemo, useCallback } from 'react'
import type { AddressData } from '@/types'

export interface TableControls {
  sortOrder: 'asc' | 'desc'
  currentPage: number
  searchTerm: string
  selectedAddresses: Set<string>
}

export interface UseTableControlsReturn {
  controls: TableControls
  updateControls: (updates: Partial<TableControls>) => void
  paginatedData: AddressData[]
  sortedAndFilteredData: AddressData[]
  pageCount: number
  itemsPerPage: number
}

export function useTableControls(tableData: AddressData[]): UseTableControlsReturn {
  const [controls, setControls] = useState<TableControls>({
    sortOrder: 'desc',
    currentPage: 1,
    searchTerm: '',
    selectedAddresses: new Set<string>()
  })

  const itemsPerPage = 10

  const sortedAndFilteredData = useMemo(() => {
    return [...tableData]
      .filter(item => 
        item.address.toLowerCase().includes(controls.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        return controls.sortOrder === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount
      })
  }, [tableData, controls.sortOrder, controls.searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = (controls.currentPage - 1) * itemsPerPage
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredData, controls.currentPage])

  const updateControls = useCallback((updates: Partial<TableControls>) => {
    setControls(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    controls,
    updateControls,
    paginatedData,
    sortedAndFilteredData,
    pageCount: Math.ceil(sortedAndFilteredData.length / itemsPerPage),
    itemsPerPage,
  }
}