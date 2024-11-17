// hooks/useAddressData.ts
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import type { AddressData } from '@/types'

export function useAddressData() {
  const [tableData, setTableData] = useState<AddressData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('addressData')
      if (savedData) {
        setTableData(JSON.parse(savedData))
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error loading data",
        description: "There was an error loading your saved data.",
        variant: "destructive"
      })
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('addressData', JSON.stringify(tableData))
    } catch (error) {
      console.error('Error saving data:', error)
      toast({
        title: "Error saving data",
        description: "There was an error saving your data.",
        variant: "destructive"
      })
    }
  }, [tableData])

  const addOrUpdateAddresses = useCallback((newData: AddressData[]) => {
    setTableData(prevData => {
      const updatedData = [...prevData]
      newData.forEach(item => {
        const existingIndex = updatedData.findIndex(existing => 
          existing.address.toLowerCase() === item.address.toLowerCase()
        )
        if (existingIndex !== -1) {
          updatedData[existingIndex].amount += item.amount
        } else {
          updatedData.push(item)
        }
      })
      return updatedData
    })
  }, [])

  const deleteAddresses = useCallback((addresses: Set<string>) => {
    setTableData(prevData => 
      prevData.filter(item => !addresses.has(item.address))
    )
  }, [])

  const clearAllData = useCallback(() => {
    setTableData([])
    localStorage.removeItem('addressData')
  }, [])

  return {
    tableData,
    setTableData,
    isLoading,
    setIsLoading,
    addOrUpdateAddresses,
    deleteAddresses,
    clearAllData,
  }
}