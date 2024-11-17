// utils/formatters.ts
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount)
}

export const formatDate = (date: string, format: 'MM/DD/YYYY' | 'DD/MM/YYYY'): string => {
  const parts = date.split(/[/-]/)
  if (parts.length !== 3) return date

  const [first, second, year] = parts
  if (format === 'MM/DD/YYYY') {
    return `${first.padStart(2, '0')}/${second.padStart(2, '0')}/${year}`
  }
  return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${year}`
}

