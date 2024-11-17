// hooks/useAddressData.ts
import { useState, useEffect } from 'react'
import { AddressData, ToastMessage } from '@/types'
import { useToast } from "@/components/ui/use-toast"

export function useAddressData() {
  const [tableData, setTableData] = useState<AddressData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('allocateXProData')
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

  useEffect(() => {
    try {
      localStorage.setItem('allocateXProData', JSON.stringify(tableData))
    } catch (error) {
      console.error('Error saving data:', error)
      toast({
        title: "Error saving data",
        description: "There was an error saving your data.",
        variant: "destructive"
      })
    }
  }, [tableData])

  const addOrUpdateAddresses = (newData: AddressData[]) => {
    setTableData(prevData => {
      const newTableData = [...prevData]
      newData.forEach(item => {
        const existingIndex = newTableData.findIndex(existing => existing.address === item.address)
        if (existingIndex !== -1) {
          newTableData[existingIndex].amount += item.amount
        } else {
          newTableData.push(item)
        }
      })
      return newTableData
    })
  }

  const deleteAddresses = (addresses: Set<string>) => {
    setTableData(prevData => prevData.filter(item => !addresses.has(item.address)))
  }

  const clearData = () => {
    setTableData([])
    localStorage.removeItem('allocateXProData')
  }

  return {
    tableData,
    setTableData,
    isLoading,
    setIsLoading,
    addOrUpdateAddresses,
    deleteAddresses,
    clearData
  }
}

