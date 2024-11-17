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

export interface TableActionProps {
  selectedCount: number
  totalCount: number
  searchTerm: string
  onSearchChange: (term: string) => void
  onDelete?: () => void
  onExport?: (format: 'excel' | 'csv' | 'json') => void
}

export interface PaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  totalItems: number
}

export interface FileUploadResult {
  success: boolean
  data?: AddressData[]
  error?: string
}