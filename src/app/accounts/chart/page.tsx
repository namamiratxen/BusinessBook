'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Filter, Download, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Account {
  id: string
  code: string
  name: string
  accountType: string
  category: string
  parentAccount?: string
  currentBalance: number
  isActive: boolean
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      code: '1001',
      name: 'Cash - Checking Account',
      accountType: 'Bank',
      category: 'ASSET',
      currentBalance: 25000.00,
      isActive: true
    },
    {
      id: '2',
      code: '1002',
      name: 'Cash - Savings Account',
      accountType: 'Bank',
      category: 'ASSET',
      currentBalance: 15000.00,
      isActive: true
    },
    {
      id: '3',
      code: '1200',
      name: 'Accounts Receivable',
      accountType: 'Receivables',
      category: 'ASSET',
      currentBalance: 8500.00,
      isActive: true
    },
    {
      id: '4',
      code: '2001',
      name: 'Accounts Payable',
      accountType: 'Payables',
      category: 'LIABILITY',
      currentBalance: 4200.00,
      isActive: true
    },
    {
      id: '5',
      code: '3001',
      name: 'Owner\'s Equity',
      accountType: 'Equity',
      category: 'EQUITY',
      currentBalance: 50000.00,
      isActive: true
    },
    {
      id: '6',
      code: '4001',
      name: 'Sales Revenue',
      accountType: 'Revenue',
      category: 'REVENUE',
      currentBalance: 75000.00,
      isActive: true
    },
    {
      id: '7',
      code: '5001',
      name: 'Cost of Goods Sold',
      accountType: 'Cost of Sales',
      category: 'EXPENSE',
      currentBalance: 35000.00,
      isActive: true
    },
    {
      id: '8',
      code: '5010',
      name: 'Office Supplies',
      accountType: 'Operating Expenses',
      category: 'EXPENSE',
      currentBalance: 1200.00,
      isActive: true
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const accountTypeOptions = [
    { value: 'bank', label: 'Bank' },
    { value: 'receivables', label: 'Accounts Receivable' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'fixed-assets', label: 'Fixed Assets' },
    { value: 'payables', label: 'Accounts Payable' },
    { value: 'credit-cards', label: 'Credit Cards' },
    { value: 'equity', label: 'Equity' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'cost-of-sales', label: 'Cost of Sales' },
    { value: 'operating-expenses', label: 'Operating Expenses' },
  ]

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'ASSET', label: 'Assets' },
    { value: 'LIABILITY', label: 'Liabilities' },
    { value: 'EQUITY', label: 'Equity' },
    { value: 'REVENUE', label: 'Revenue' },
    { value: 'EXPENSE', label: 'Expenses' },
  ]

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm)
    const matchesCategory = !filterCategory || account.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const columns = [
    {
      key: 'code',
      label: 'Account Code',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Account Name',
      sortable: true,
    },
    {
      key: 'accountType',
      label: 'Type',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'ASSET' ? 'bg-green-100 text-green-800' :
          value === 'LIABILITY' ? 'bg-red-100 text-red-800' :
          value === 'EQUITY' ? 'bg-blue-100 text-blue-800' :
          value === 'REVENUE' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'currentBalance',
      label: 'Current Balance',
      render: (value: number) => formatCurrency(value),
      className: 'text-right',
      sortable: true,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  const handleEdit = (account: Account) => {
    setSelectedAccount(account)
    setShowEditModal(true)
  }

  const handleDelete = (account: Account) => {
    if (confirm(`Are you sure you want to delete account "${account.name}"?`)) {
      setAccounts(accounts.filter(a => a.id !== account.id))
    }
  }

  const actions = [
    {
      label: 'Edit',
      onClick: handleEdit,
      variant: 'primary' as const
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger' as const
    }
  ]

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
            <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
            <p className="text-gray-600 mt-2">Manage your company's chart of accounts and financial structure</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Account
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
          </div>
          <Select
            options={categoryOptions}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="Filter by category"
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Accounts Table */}
      <Table
        data={filteredAccounts}
        columns={columns}
        loading={isLoading}
        actions={actions}
        onRowClick={(account) => console.log('View account details:', account)}
      />

      {/* Create Account Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Account"
        size="lg"
      >
        <CreateAccountForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Account"
        size="lg"
      >
        {selectedAccount && (
          <EditAccountForm 
            account={selectedAccount}
            onClose={() => setShowEditModal(false)} 
          />
        )}
      </Modal>
    </DashboardLayout>
  )
}

// Create Account Form Component
function CreateAccountForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    accountType: '',
    category: 'ASSET',
    parentAccount: '',
    openingBalance: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement create account logic
    console.log('Creating account:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Account Code"
          name="code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          placeholder="1001"
          required
        />
        <Input
          label="Account Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Cash - Checking"
          required
        />
      </div>

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Main operating checking account"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          options={[
            { value: 'ASSET', label: 'Asset' },
            { value: 'LIABILITY', label: 'Liability' },
            { value: 'EQUITY', label: 'Equity' },
            { value: 'REVENUE', label: 'Revenue' },
            { value: 'EXPENSE', label: 'Expense' },
          ]}
          required
        />
        <Select
          label="Account Type"
          name="accountType"
          value={formData.accountType}
          onChange={(e) => setFormData({...formData, accountType: e.target.value})}
          options={[
            { value: 'bank', label: 'Bank' },
            { value: 'receivables', label: 'Accounts Receivable' },
            { value: 'inventory', label: 'Inventory' },
            { value: 'fixed-assets', label: 'Fixed Assets' },
            { value: 'payables', label: 'Accounts Payable' },
            { value: 'equity', label: 'Equity' },
            { value: 'revenue', label: 'Revenue' },
            { value: 'expenses', label: 'Expenses' },
          ]}
          required
        />
      </div>

      <Input
        label="Opening Balance"
        type="number"
        step="0.01"
        name="openingBalance"
        value={formData.openingBalance}
        onChange={(e) => setFormData({...formData, openingBalance: parseFloat(e.target.value) || 0})}
        placeholder="0.00"
      />

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Account
        </Button>
      </div>
    </form>
  )
}

// Edit Account Form Component
function EditAccountForm({ account, onClose }: { account: Account; onClose: () => void }) {
  const [formData, setFormData] = useState({
    code: account.code,
    name: account.name,
    accountType: account.accountType,
    category: account.category,
    isActive: account.isActive
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement update account logic
    console.log('Updating account:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Account Code"
          name="code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          required
        />
        <Input
          label="Account Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          options={[
            { value: 'ASSET', label: 'Asset' },
            { value: 'LIABILITY', label: 'Liability' },
            { value: 'EQUITY', label: 'Equity' },
            { value: 'REVENUE', label: 'Revenue' },
            { value: 'EXPENSE', label: 'Expense' },
          ]}
          required
        />
        <div className="flex items-center space-x-3 pt-6">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-900">
            Account is active
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update Account
        </Button>
      </div>
    </form>
  )
}