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

export interface PaginationInfo {
  currentPage: number
  pageCount: number
  totalItems: number
  itemsPerPage: number
}

export interface TableActionProps {
  selectedCount: number
  totalCount: number
  searchTerm: string
  onSearchChange: (term: string) => void
  onDelete: () => void
  onExport: (format: 'excel' | 'csv' | 'json') => void
  data?: AddressData[]
}

export interface ToastMessage {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export type SortOrder = 'asc' | 'desc'

export interface PaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  totalItems: number
}

export interface PaginationRange {
  start: number
  end: number
  totalPages: number
}

export interface UsePaginationReturn extends PaginationInfo {
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  canNextPage: boolean
  canPrevPage: boolean
}