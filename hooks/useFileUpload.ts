// hooks/useFileUpload.ts
import { useState, useCallback } from 'react'
import { utils, read } from 'xlsx'
import { AddressData, FileUploadResult } from '@/types'
import { useToast } from "@/components/ui/use-toast"
import { validateAddressData } from '@/utils/validators'

export function useFileUpload() {
  const [inputData, setInputData] = useState('')
  const { toast } = useToast()

  const parseCSV = useCallback((content: string): AddressData[] => {
    const lines = content.split('\n')
    return lines
      .map(line => {
        const [address, amount] = line.split(',').map(item => item.trim())
        return { 
          address, 
          amount: Math.round(parseFloat(amount) || 0) 
        }
      })
      .filter(validateAddressData)
  }, [])

  const parseExcel = useCallback((content: ArrayBuffer): AddressData[] => {
    const workbook = read(content, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = utils.sheet_to_json(worksheet, { header: ['address', 'amount'] })
    return jsonData
      .map((row: any) => ({
        address: row.address,
        amount: Math.round(parseFloat(row.amount) || 0)
      }))
      .filter(validateAddressData)
  }, [])

  const handleFileUpload = useCallback(async (file: File): Promise<FileUploadResult> => {
    try {
      const content = await file.arrayBuffer()
      let parsedData: AddressData[]

      if (file.name.endsWith('.csv')) {
        const text = new TextDecoder().decode(content)
        parsedData = parseCSV(text)
      } else {
        parsedData = parseExcel(content)
      }

      if (parsedData.length === 0) {
        return {
          success: false,
          error: 'No valid data found in file'
        }
      }

      return {
        success: true,
        data: parsedData
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error processing file'
      }
    }
  }, [parseCSV, parseExcel])

  return {
    inputData,
    setInputData,
    handleFileUpload
  }
}

