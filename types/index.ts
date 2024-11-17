// types/index.ts
export interface AddressData {
  address: string
  amount: number
}

export interface TableControls {
  sortOrder: 'asc' | 'desc'
  currentPage: number
  searchTerm: string
  selectedAddresses: Set<string>
}

export interface FileUploadResult {
  success: boolean
  data?: AddressData[]
  error?: string
}

export interface ToolSettings {
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY'
  caseSensitive: boolean
  includeHeaders: boolean
}

export type ToastMessage = {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}