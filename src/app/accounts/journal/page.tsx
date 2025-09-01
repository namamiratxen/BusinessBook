'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Modal from '@/components/ui/Modal'
import { Plus, Search, Filter, Download, Edit, Trash2, FileText, CheckCircle, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface JournalEntry {
  id: string
  entryNumber: string
  date: Date
  reference?: string
  description: string
  totalAmount: number
  isPosted: boolean
  isRecurring: boolean
  createdBy: string
  lineItems: JournalLineItem[]
}

interface JournalLineItem {
  id: string
  description?: string
  account: string
  accountCode: string
  debitAmount: number
  creditAmount: number
}

export default function JournalEntriesPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      entryNumber: 'JE-2024-001',
      date: new Date('2024-01-15'),
      reference: 'INV-2024-001',
      description: 'Sales invoice to ABC Corp',
      totalAmount: 5500.00,
      isPosted: true,
      isRecurring: false,
      createdBy: 'John Doe',
      lineItems: [
        {
          id: '1-1',
          description: 'Sales revenue',
          account: 'Accounts Receivable',
          accountCode: '1200',
          debitAmount: 5500.00,
          creditAmount: 0.00
        },
        {
          id: '1-2',
          description: 'Sales revenue',
          account: 'Sales Revenue',
          accountCode: '4001',
          debitAmount: 0.00,
          creditAmount: 5500.00
        }
      ]
    },
    {
      id: '2',
      entryNumber: 'JE-2024-002',
      date: new Date('2024-01-14'),
      reference: 'BILL-2024-001',
      description: 'Office supplies purchase',
      totalAmount: 245.30,
      isPosted: true,
      isRecurring: false,
      createdBy: 'Jane Smith',
      lineItems: [
        {
          id: '2-1',
          description: 'Office supplies',
          account: 'Office Supplies',
          accountCode: '5010',
          debitAmount: 245.30,
          creditAmount: 0.00
        },
        {
          id: '2-2',
          description: 'Office supplies',
          account: 'Accounts Payable',
          accountCode: '2001',
          debitAmount: 0.00,
          creditAmount: 245.30
        }
      ]
    },
    {
      id: '3',
      entryNumber: 'JE-2024-003',
      date: new Date('2024-01-13'),
      reference: 'PAY-2024-001',
      description: 'Rent payment for January',
      totalAmount: 2000.00,
      isPosted: false,
      isRecurring: true,
      createdBy: 'John Doe',
      lineItems: [
        {
          id: '3-1',
          description: 'Monthly rent',
          account: 'Rent Expense',
          accountCode: '5020',
          debitAmount: 2000.00,
          creditAmount: 0.00
        },
        {
          id: '3-2',
          description: 'Monthly rent',
          account: 'Cash - Checking Account',
          accountCode: '1001',
          debitAmount: 0.00,
          creditAmount: 2000.00
        }
      ]
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Entries' },
    { value: 'posted', label: 'Posted' },
    { value: 'draft', label: 'Draft' },
    { value: 'recurring', label: 'Recurring' },
  ]

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.reference && entry.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesStatus = true
    if (filterStatus === 'posted') matchesStatus = entry.isPosted
    if (filterStatus === 'draft') matchesStatus = !entry.isPosted
    if (filterStatus === 'recurring') matchesStatus = entry.isRecurring
    
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'entryNumber',
      label: 'Entry Number',
      sortable: true,
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: Date) => formatDate(value, 'short'),
      sortable: true,
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (value: string) => value || '-',
    },
    {
      key: 'description',
      label: 'Description',
      className: 'max-w-xs truncate',
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value: number) => formatCurrency(value),
      className: 'text-right',
      sortable: true,
    },
    {
      key: 'isPosted',
      label: 'Status',
      render: (value: boolean, row: JournalEntry) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {value ? 'Posted' : 'Draft'}
          </span>
          {row.isRecurring && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Recurring
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
  ]

  const handleView = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setShowViewModal(true)
  }

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    // Open edit modal
  }

  const handleDelete = (entry: JournalEntry) => {
    if (entry.isPosted) {
      alert('Cannot delete posted journal entries')
      return
    }
    
    if (confirm(`Are you sure you want to delete journal entry "${entry.entryNumber}"?`)) {
      setJournalEntries(journalEntries.filter(e => e.id !== entry.id))
    }
  }

  const handlePost = (entry: JournalEntry) => {
    if (confirm(`Are you sure you want to post journal entry "${entry.entryNumber}"?`)) {
      setJournalEntries(journalEntries.map(e => 
        e.id === entry.id ? { ...e, isPosted: true } : e
      ))
    }
  }

  const actions = [
    {
      label: 'View',
      onClick: handleView,
      variant: 'primary' as const
    },
    {
      label: 'Edit',
      onClick: handleEdit,
      variant: 'secondary' as const
    },
    {
      label: 'Post',
      onClick: handlePost,
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
            <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
            <p className="text-gray-600 mt-2">Create and manage journal entries for your general ledger</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{journalEntries.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Posted</p>
              <p className="text-2xl font-bold text-green-600">
                {journalEntries.filter(e => e.isPosted).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">
                {journalEntries.filter(e => !e.isPosted).length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(journalEntries.reduce((sum, e) => sum + e.totalAmount, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
          </div>
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            placeholder="Filter by status"
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Journal Entries Table */}
      <Table
        data={filteredEntries}
        columns={columns}
        loading={isLoading}
        actions={actions}
        onRowClick={handleView}
      />

      {/* View Journal Entry Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedEntry ? `Journal Entry - ${selectedEntry.entryNumber}` : 'Journal Entry'}
        size="xl"
      >
        {selectedEntry && <JournalEntryDetailView entry={selectedEntry} />}
      </Modal>

      {/* Create Journal Entry Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Journal Entry"
        size="xl"
      >
        <CreateJournalEntryForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </DashboardLayout>
  )
}

// Journal Entry Detail View
function JournalEntryDetailView({ entry }: { entry: JournalEntry }) {
  const totalDebits = entry.lineItems.reduce((sum, item) => sum + item.debitAmount, 0)
  const totalCredits = entry.lineItems.reduce((sum, item) => sum + item.creditAmount, 0)

  return (
    <div className="space-y-6">
      {/* Entry Header */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Entry Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Entry Number:</span> {entry.entryNumber}</div>
            <div><span className="text-gray-600">Date:</span> {formatDate(entry.date)}</div>
            <div><span className="text-gray-600">Reference:</span> {entry.reference || '-'}</div>
            <div><span className="text-gray-600">Created By:</span> {entry.createdBy}</div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Status & Amount</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                entry.isPosted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {entry.isPosted ? 'Posted' : 'Draft'}
              </span>
            </div>
            <div><span className="text-gray-600">Total Amount:</span> {formatCurrency(entry.totalAmount)}</div>
            <div><span className="text-gray-600">Recurring:</span> {entry.isRecurring ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{entry.description}</p>
      </div>

      {/* Line Items */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Line Items</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entry.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">
                    <div>
                      <div className="font-medium text-gray-900">{item.account}</div>
                      <div className="text-xs text-gray-500">{item.accountCode}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700">{item.description || '-'}</td>
                  <td className="px-4 py-2 text-right">
                    {item.debitAmount > 0 ? formatCurrency(item.debitAmount) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {item.creditAmount > 0 ? formatCurrency(item.creditAmount) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td colSpan={2} className="px-4 py-2 text-gray-900">Totals</td>
                <td className="px-4 py-2 text-right">{formatCurrency(totalDebits)}</td>
                <td className="px-4 py-2 text-right">{formatCurrency(totalCredits)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Balance Check */}
        <div className={`mt-4 p-3 rounded-md ${
          totalDebits === totalCredits 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {totalDebits === totalCredits 
            ? '✓ Entry is balanced' 
            : `⚠ Entry is not balanced (Difference: ${formatCurrency(Math.abs(totalDebits - totalCredits))})`
          }
        </div>
      </div>
    </div>
  )
}

// Create Journal Entry Form
function CreateJournalEntryForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    isRecurring: false
  })

  const [lineItems, setLineItems] = useState([
    { account: '', accountCode: '', description: '', debitAmount: 0, creditAmount: 0 },
    { account: '', accountCode: '', description: '', debitAmount: 0, creditAmount: 0 }
  ])

  const addLineItem = () => {
    setLineItems([...lineItems, { account: '', accountCode: '', description: '', debitAmount: 0, creditAmount: 0 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 2) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const totalDebits = lineItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  const totalCredits = lineItems.reduce((sum, item) => sum + (item.creditAmount || 0), 0)
  const isBalanced = totalDebits === totalCredits && totalDebits > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBalanced) {
      alert('Journal entry must be balanced (total debits = total credits)')
      return
    }
    
    // TODO: Implement create journal entry logic
    console.log('Creating journal entry:', { formData, lineItems })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Entry Details */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required
        />
        <Input
          label="Reference"
          value={formData.reference}
          onChange={(e) => setFormData({...formData, reference: e.target.value})}
          placeholder="INV-2024-001"
        />
        <div className="flex items-center pt-6">
          <input
            id="isRecurring"
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-900">
            Recurring Entry
          </label>
        </div>
      </div>

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Describe this journal entry"
        required
      />

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Line Items</h4>
          <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Line
          </Button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-lg">
              <div className="col-span-3">
                <Select
                  label={index === 0 ? "Account" : ""}
                  options={[
                    { value: '1001', label: '1001 - Cash - Checking' },
                    { value: '1200', label: '1200 - Accounts Receivable' },
                    { value: '2001', label: '2001 - Accounts Payable' },
                    { value: '4001', label: '4001 - Sales Revenue' },
                    { value: '5010', label: '5010 - Office Supplies' },
                    { value: '5020', label: '5020 - Rent Expense' },
                  ]}
                  value={item.account}
                  onChange={(e) => updateLineItem(index, 'account', e.target.value)}
                  placeholder="Select account"
                />
              </div>
              <div className="col-span-3">
                <Input
                  label={index === 0 ? "Description" : ""}
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  placeholder="Line description"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label={index === 0 ? "Debit" : ""}
                  type="number"
                  step="0.01"
                  value={item.debitAmount || ''}
                  onChange={(e) => updateLineItem(index, 'debitAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label={index === 0 ? "Credit" : ""}
                  type="number"
                  step="0.01"
                  value={item.creditAmount || ''}
                  onChange={(e) => updateLineItem(index, 'creditAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                {lineItems.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total Debits: {formatCurrency(totalDebits)}</span>
            <span>Total Credits: {formatCurrency(totalCredits)}</span>
          </div>
          <div className={`mt-2 text-center font-medium ${
            isBalanced ? 'text-green-600' : 'text-red-600'
          }`}>
            {isBalanced ? '✓ Entry is balanced' : `⚠ Difference: ${formatCurrency(Math.abs(totalDebits - totalCredits))}`}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary" disabled={!isBalanced}>
          Save as Draft
        </Button>
        <Button type="submit" variant="primary" disabled={!isBalanced}>
          Post Entry
        </Button>
      </div>
    </form>
  )
}