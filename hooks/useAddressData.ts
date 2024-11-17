// hooks/useAddressData.ts
import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { AddressData } from '@/types'
import { useToast } from '@/components/ui/use-toast'

export function useAddressData() {
  const [tableData, setTableData] = useLocalStorage<AddressData[]>('addressData', [])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
  }, [setTableData])

  const deleteAddresses = useCallback((addresses: Set<string>) => {
    setTableData(prevData => 
      prevData.filter(item => !addresses.has(item.address))
    )
  }, [setTableData])

  const clearData = useCallback(() => {
    setTableData([])
    toast({
      title: "Data cleared",
      description: "All address data has been cleared."
    })
  }, [setTableData, toast])

  return {
    tableData,
    setTableData,
    isLoading,
    setIsLoading,
    addOrUpdateAddresses,
    deleteAddresses,
    clearData,
  } as const
}

export type UseAddressDataReturn = ReturnType<typeof useAddressData>

