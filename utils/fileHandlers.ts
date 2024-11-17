// utils/fileHandlers.ts
import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'
import { AddressData } from '@/types'

export const downloadExcel = (data: AddressData[], filename: string = 'addresses.xlsx') => {
  try {
    const worksheet = utils.json_to_sheet(data)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Addresses")
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    saveAs(blob, filename)
    return true
  } catch (error) {
    console.error('Error downloading Excel:', error)
    return false
  }
}

export const downloadCSV = (data: AddressData[], filename: string = 'addresses.csv') => {
  try {
    const csvContent = data
      .map(row => `${row.address},${row.amount}`)
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, filename)
    return true
  } catch (error) {
    console.error('Error downloading CSV:', error)
    return false
  }
}

export const downloadJSON = (data: AddressData[], filename: string = 'addresses.json') => {
  try {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    saveAs(blob, filename)
    return true
  } catch (error) {
    console.error('Error downloading JSON:', error)
    return false
  }
}