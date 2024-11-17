// utils/validators.ts
import { AddressData } from '@/types'

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const validateAddressData = (data: AddressData): boolean => {
  return (
    isValidEthereumAddress(data.address) &&
    !isNaN(data.amount) &&
    data.amount >= 0
  )
}

