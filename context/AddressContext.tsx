// context/AddressContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useToast } from "@/components/ui/use-toast"
import type { AddressData } from '@/types'

interface AddressContextType {
  tableData: AddressData[]
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  addOrUpdateAddresses: (newData: AddressData[]) => void
  deleteAddresses: (addresses: Set<string>) => void
  clearAllData: () => void
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [tableData, setTableData] = useState<AddressData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('addressData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        console.log('Loading saved data:', parsedData)
        setTableData(parsedData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      console.log('Saving data:', tableData)
      localStorage.setItem('addressData', JSON.stringify(tableData))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }, [tableData])

  const addOrUpdateAddresses = useCallback((newData: AddressData[]) => {
    console.log('Adding new data:', newData)
    if (!newData || newData.length === 0) return

    setTableData(prevData => {
      const updatedData = [...prevData]
      newData.forEach(item => {
        const existingIndex = updatedData.findIndex(existing => 
          existing.address.toLowerCase() === item.address.toLowerCase()
        )
        if (existingIndex !== -1) {
          updatedData[existingIndex] = {
            ...updatedData[existingIndex],
            amount: updatedData[existingIndex].amount + item.amount
          }
        } else {
          updatedData.push(item)
        }
      })
      console.log('Updated data:', updatedData)
      return updatedData
    })
  }, [])

  const deleteAddresses = useCallback((addresses: Set<string>) => {
    console.log('Deleting addresses:', addresses)
    setTableData(prevData => 
      prevData.filter(item => !addresses.has(item.address))
    )
  }, [])

  const clearAllData = useCallback(() => {
    console.log('Clearing all data')
    setTableData([])
    localStorage.removeItem('addressData')
  }, [])

  const value = {
    tableData,
    isLoading,
    setIsLoading,
    addOrUpdateAddresses,
    deleteAddresses,
    clearAllData
  }

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  )
}

export function useAddressData() {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error('useAddressData must be used within an AddressProvider')
  }
  return context
}