// hooks/useTableControls.ts
import { useState, useMemo } from 'react'
import { AddressData, TableControls } from '@/types'

export function useTableControls(tableData: AddressData[]) {
  const [controls, setControls] = useState<TableControls>({
    sortOrder: 'desc',
    currentPage: 1,
    searchTerm: '',
    selectedAddresses: new Set()
  })
  const itemsPerPage = 10

  const sortedAndFilteredData = useMemo(() => {
    return [...tableData]
      .filter(item => 
        item.address.toLowerCase().includes(controls.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        return controls.sortOrder === 'asc' ? 
          a.amount - b.amount : 
          b.amount - a.amount
      })
  }, [tableData, controls.sortOrder, controls.searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = (controls.currentPage - 1) * itemsPerPage
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredData, controls.currentPage])

  const pageCount = Math.ceil(sortedAndFilteredData.length / itemsPerPage)

  const updateControls = (updates: Partial<TableControls>) => {
    setControls(prev => ({ ...prev, ...updates }))
  }

  const resetControls = () => {
    setControls({
      sortOrder: 'desc',
      currentPage: 1,
      searchTerm: '',
      selectedAddresses: new Set()
    })
  }

  return {
    controls,
    updateControls,
    resetControls,
    paginatedData,
    sortedAndFilteredData,
    pageCount,
    itemsPerPage
  }
}