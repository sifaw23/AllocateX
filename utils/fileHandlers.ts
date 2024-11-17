// utils/fileHandlers.ts
import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'
import { AddressData } from '@/types'

export const downloadExcel = (data: AddressData[], filename: string = 'addresses.xlsx') => {
  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Addresses")
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  saveAs(blob, filename)
}

export const downloadCSV = (data: AddressData[], filename: string = 'addresses.csv') => {
  const csvContent = data
    .map(row => `${row.address},${row.amount}`)
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}

export const downloadJSON = (data: AddressData[], filename: string = 'addresses.json') => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  saveAs(blob, filename)
}
