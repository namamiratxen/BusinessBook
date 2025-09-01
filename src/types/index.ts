import { UserRole, AccountCategory, InvoiceStatus, BillStatus, PaymentMethod, PeriodStatus } from '@prisma/client'

export interface User {
  id: string
  email: string
  username?: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  logo?: string
  isActive: boolean
  subscription: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  legalName?: string
  registrationNo?: string
  taxId?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  baseCurrency: string
  fiscalYearStart: Date
  isActive: boolean
  tenantId: string
}

export interface Account {
  id: string
  code: string
  name: string
  description?: string
  accountType: {
    name: string
    category: AccountCategory
    normalSide: string
  }
  parentAccountId?: string
  openingBalance: number
  currentBalance: number
  isActive: boolean
  allowPosting: boolean
  companyId: string
}

export interface JournalEntry {
  id: string
  entryNumber: string
  date: Date
  reference?: string
  description: string
  totalAmount: number
  isPosted: boolean
  isRecurring: boolean
  companyId: string
  createdById: string
  lineItems: JournalLineItem[]
}

export interface JournalLineItem {
  id: string
  description?: string
  debitAmount: number
  creditAmount: number
  accountId: string
  account: Account
}

export interface Vendor {
  id: string
  vendorNumber: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  billingAddress?: string
  shippingAddress?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  paymentTerms?: string
  creditLimit?: number
  taxId?: string
  isActive: boolean
  companyId: string
}

export interface Customer {
  id: string
  customerNumber: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  billingAddress?: string
  shippingAddress?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  paymentTerms?: string
  creditLimit?: number
  taxId?: string
  isActive: boolean
  companyId: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  status: InvoiceStatus
  notes?: string
  terms?: string
  customerId: string
  customer: Customer
  companyId: string
  lineItems: InvoiceLineItem[]
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  lineTotal: number
}

export interface Bill {
  id: string
  billNumber: string
  vendorRef?: string
  date: Date
  dueDate: Date
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  status: BillStatus
  notes?: string
  vendorId: string
  vendor: Vendor
  companyId: string
  lineItems: BillLineItem[]
}

export interface BillLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  lineTotal: number
}

export interface Payment {
  id: string
  paymentNumber: string
  date: Date
  amount: number
  method: PaymentMethod
  reference?: string
  notes?: string
  customerId?: string
  vendorId?: string
  invoiceId?: string
  billId?: string
  bankAccountId?: string
  companyId: string
}

export interface BankAccount {
  id: string
  accountName: string
  accountNumber: string
  bankName: string
  branchName?: string
  ifscCode?: string
  swiftCode?: string
  routingNumber?: string
  accountType: string
  currentBalance: number
  isActive: boolean
  companyId: string
}

export interface FinancialPeriod {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: PeriodStatus
  companyId: string
}

// Form Types
export interface CreateUserForm {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  password: string
  confirmPassword: string
}

export interface CreateCompanyForm {
  name: string
  legalName?: string
  registrationNo?: string
  taxId?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  baseCurrency: string
}

export interface CreateAccountForm {
  code: string
  name: string
  description?: string
  accountTypeId: string
  parentAccountId?: string
  openingBalance: number
}

export interface CreateVendorForm {
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  billingAddress?: string
  shippingAddress?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  paymentTerms?: string
  creditLimit?: number
  taxId?: string
}

export interface CreateCustomerForm {
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  billingAddress?: string
  shippingAddress?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  paymentTerms?: string
  creditLimit?: number
  taxId?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  cashBalance: number
  pendingInvoices: number
  overdueBills: number
  recentTransactions: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}