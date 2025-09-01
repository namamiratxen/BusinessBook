'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Receipt, 
  CreditCard,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DashboardStats {
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  cashBalance: number
  pendingInvoices: number
  overdueBills: number
  activeCustomers: number
  activeVendors: number
}

interface RecentTransaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: Date
  account: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 125450.00,
    totalExpenses: 89230.50,
    netIncome: 36219.50,
    cashBalance: 45780.25,
    pendingInvoices: 12,
    overdueBills: 3,
    activeCustomers: 45,
    activeVendors: 23
  })

  const [recentTransactions] = useState<RecentTransaction[]>([
    {
      id: '1',
      type: 'income',
      description: 'Payment from ABC Corp',
      amount: 5500.00,
      date: new Date('2024-01-15'),
      account: 'Checking Account'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Office Supplies - Staples',
      amount: 245.30,
      date: new Date('2024-01-14'),
      account: 'Office Expenses'
    },
    {
      id: '3',
      type: 'income',
      description: 'Consulting Services - XYZ Ltd',
      amount: 2800.00,
      date: new Date('2024-01-14'),
      account: 'Professional Services'
    },
    {
      id: '4',
      type: 'expense',
      description: 'Utility Bill - Electric Company',
      amount: 189.45,
      date: new Date('2024-01-13'),
      account: 'Utilities'
    },
    {
      id: '5',
      type: 'income',
      description: 'Product Sales - Online Store',
      amount: 1250.75,
      date: new Date('2024-01-13'),
      account: 'Sales Revenue'
    }
  ])

  const currentUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@demo.com',
    role: 'Super Admin'
  }

  return (
    <DashboardLayout currentUser={currentUser}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {currentUser.firstName}! Here's your business overview.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Quick Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.netIncome)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +18.3% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.cashBalance)}</p>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <CreditCard className="h-4 w-4 mr-1" />
                Across 3 accounts
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Receipt className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              New Customer
            </Button>
          </div>
        </Card>

        {/* Alerts & Notifications */}
        <Card title="Alerts & Notifications" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  {stats.overdueBills} overdue bills require attention
                </p>
                <p className="text-xs text-yellow-600">Total amount: $12,450.00</p>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="h-5 w-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  {stats.pendingInvoices} invoices pending for this month
                </p>
                <p className="text-xs text-blue-600">Expected revenue: $28,750.00</p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Bank reconciliation completed for December
                </p>
                <p className="text-xs text-green-600">All transactions matched successfully</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card 
          title="Recent Transactions" 
          action={
            <Button variant="ghost" size="sm">
              View All
            </Button>
          }
        >
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center
                    ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
                  `}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.account}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.date, 'short')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Business Summary */}
        <Card title="Business Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Active Customers</span>
              <span className="text-sm font-medium text-gray-900">{stats.activeCustomers}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Active Vendors</span>
              <span className="text-sm font-medium text-gray-900">{stats.activeVendors}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Pending Invoices</span>
              <span className="text-sm font-medium text-yellow-600">{stats.pendingInvoices}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Overdue Bills</span>
              <span className="text-sm font-medium text-red-600">{stats.overdueBills}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Current Month P&L</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(stats.netIncome)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Health Indicators */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Cash Flow Trend">
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">Chart visualization would go here</p>
          </div>
        </Card>

        <Card title="Monthly Revenue">
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">Revenue chart would go here</p>
          </div>
        </Card>

        <Card title="Expense Breakdown">
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">Expense pie chart would go here</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}