import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency: string = 'USD') {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numericAmount)
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'medium' = 'medium') {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: '2-digit' 
      })
    case 'long':
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    default:
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
  }
}

export function generateAccountCode(category: string, sequence: number): string {
  const categoryPrefixes = {
    'ASSET': '1',
    'LIABILITY': '2',
    'EQUITY': '3',
    'REVENUE': '4',
    'EXPENSE': '5'
  }
  
  const prefix = categoryPrefixes[category as keyof typeof categoryPrefixes] || '9'
  return `${prefix}${sequence.toString().padStart(3, '0')}`
}

export function calculateBalance(debit: number, credit: number, normalSide: 'DEBIT' | 'CREDIT'): number {
  return normalSide === 'DEBIT' ? debit - credit : credit - debit
}

export function validateTaxId(taxId: string, country: string = 'US'): boolean {
  // Basic validation - can be extended for different countries
  if (country === 'US') {
    // EIN format: XX-XXXXXXX
    return /^\d{2}-\d{7}$/.test(taxId)
  }
  return true
}

export function generateInvoiceNumber(prefix: string = 'INV', sequence: number): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
  return `${prefix}${year}${month}${sequence.toString().padStart(4, '0')}`
}

export function calculateDueDate(invoiceDate: Date, paymentTerms: string): Date {
  const dueDate = new Date(invoiceDate)
  
  switch (paymentTerms) {
    case 'NET_15':
      dueDate.setDate(dueDate.getDate() + 15)
      break
    case 'NET_30':
      dueDate.setDate(dueDate.getDate() + 30)
      break
    case 'NET_60':
      dueDate.setDate(dueDate.getDate() + 60)
      break
    case 'NET_90':
      dueDate.setDate(dueDate.getDate() + 90)
      break
    default:
      dueDate.setDate(dueDate.getDate() + 30) // Default to 30 days
  }
  
  return dueDate
}