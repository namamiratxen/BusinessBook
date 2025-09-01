'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Modal from '@/components/ui/Modal'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  FileText,
  Send,
  Eye,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Copy
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  date: Date
  dueDate: Date
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  notes?: string
  terms?: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'ABC Corporation',
      customerEmail: 'john@abccorp.com',
      date: new Date('2024-01-10'),
      dueDate: new Date('2024-02-10'),
      subtotal: 5000.00,
      taxAmount: 500.00,
      totalAmount: 5500.00,
      paidAmount: 0.00,
      balanceAmount: 5500.00,
      status: 'SENT',
      notes: 'Monthly consulting services',
      terms: 'Payment due within 30 days'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'XYZ Industries',
      customerEmail: 'jane@xyzind.com',
      date: new Date('2024-01-05'),
      dueDate: new Date('2024-02-05'),
      subtotal: 1636.36,
      taxAmount: 163.64,
      totalAmount: 1800.00,
      paidAmount: 1800.00,
      balanceAmount: 0.00,
      status: 'PAID',
      notes: 'Product delivery and setup',
      terms: 'Net 30 days'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerName: 'Tech Innovations LLC',
      customerEmail: 'mike@techinnovations.com',
      date: new Date('2024-01-15'),
      dueDate: new Date('2024-01-30'),
      subtotal: 2500.00,
      taxAmount: 250.00,
      totalAmount: 2750.00,
      paidAmount: 1000.00,
      balanceAmount: 1750.00,
      status: 'PARTIAL',
      notes: 'Software development services',
      terms: 'Net 15 days'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      customerName: 'ABC Corporation',
      customerEmail: 'john@abccorp.com',
      date: new Date('2023-12-15'),
      dueDate: new Date('2024-01-15'),
      subtotal: 3000.00,
      taxAmount: 300.00,
      totalAmount: 3300.00,
      paidAmount: 0.00,
      balanceAmount: 3300.00,
      status: 'OVERDUE',
      notes: 'Additional consulting work',
      terms: 'Payment overdue'
    }
  ])

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Invoices' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SENT', label: 'Sent' },
    { value: 'VIEWED', label: 'Viewed' },
    { value: 'PARTIAL', label: 'Partially Paid' },
    { value: 'PAID', label: 'Paid' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !filterStatus || invoice.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'SENT': return 'bg-blue-100 text-blue-800'
      case 'VIEWED': return 'bg-purple-100 text-purple-800'
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      sortable: true,
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: string, row: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.customerEmail}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'date',
      label: 'Invoice Date',
      render: (value: Date) => formatDate(value, 'short'),
      sortable: true,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value: Date) => formatDate(value, 'short'),
      sortable: true,
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (value: number) => formatCurrency(value),
      className: 'text-right',
      sortable: true,
    },
    {
      key: 'balanceAmount',
      label: 'Balance Due',
      render: (value: number, row: Invoice) => (
        <span className={`font-medium ${
          value > 0 
            ? row.status === 'OVERDUE' 
              ? 'text-red-600' 
              : 'text-orange-600'
            : 'text-green-600'
        }`}>
          {formatCurrency(value)}
        </span>
      ),
      className: 'text-right',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
      sortable: true,
    },
  ]

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowViewModal(true)
  }

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    // Open edit modal
  }

  const handleDelete = (invoice: Invoice) => {
    if (invoice.status !== 'DRAFT') {
      alert('Can only delete draft invoices')
      return
    }
    
    if (confirm(`Are you sure you want to delete invoice "${invoice.invoiceNumber}"?`)) {
      setInvoices(invoices.filter(i => i.id !== invoice.id))
    }
  }

  const handleSend = (invoice: Invoice) => {
    if (invoice.status === 'DRAFT') {
      setInvoices(invoices.map(i => 
        i.id === invoice.id ? { ...i, status: 'SENT' as const } : i
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
      label: 'Send',
      onClick: handleSend,
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

  // Calculate summary statistics
  const totalInvoices = invoices.length
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const outstandingAmount = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0)
  const overdueCount = invoices.filter(inv => inv.status === 'OVERDUE').length

  return (
    <DashboardLayout currentUser={currentUser}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-2">Create and manage customer invoices</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(paidAmount)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(outstandingAmount)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
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
                placeholder="Search invoices..."
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

      {/* Invoices Table */}
      <Table
        data={filteredInvoices}
        columns={columns}
        loading={isLoading}
        actions={actions}
        onRowClick={handleView}
      />

      {/* View Invoice Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedInvoice ? `Invoice - ${selectedInvoice.invoiceNumber}` : 'Invoice Details'}
        size="xl"
      >
        {selectedInvoice && <InvoiceDetailView invoice={selectedInvoice} />}
      </Modal>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Invoice"
        size="xl"
      >
        <CreateInvoiceForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </DashboardLayout>
  )
}

// Invoice Detail View
function InvoiceDetailView({ invoice }: { invoice: Invoice }) {
  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h2>
            <p className="text-gray-600">{invoice.customerName}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Invoice Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Invoice Date:</span> {formatDate(invoice.date)}</div>
            <div><span className="text-gray-600">Due Date:</span> {formatDate(invoice.dueDate)}</div>
            <div><span className="text-gray-600">Customer:</span> {invoice.customerName}</div>
            <div><span className="text-gray-600">Email:</span> {invoice.customerEmail}</div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Subtotal:</span> {formatCurrency(invoice.subtotal)}</div>
            <div><span className="text-gray-600">Tax Amount:</span> {formatCurrency(invoice.taxAmount)}</div>
            <div><span className="text-gray-600">Total Amount:</span> <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span></div>
            <div><span className="text-gray-600">Balance Due:</span> <span className="font-medium text-red-600">{formatCurrency(invoice.balanceAmount)}</span></div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Line Items</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-gray-900">Consulting Services - January 2024</td>
                <td className="px-4 py-2 text-right">1.00</td>
                <td className="px-4 py-2 text-right">{formatCurrency(invoice.subtotal)}</td>
                <td className="px-4 py-2 text-right">10%</td>
                <td className="px-4 py-2 text-right font-medium">{formatCurrency(invoice.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invoice.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Terms</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <Button variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="primary">
          <Send className="h-4 w-4 mr-2" />
          Send Invoice
        </Button>
      </div>
    </div>
  )
}

// Create Invoice Form
function CreateInvoiceForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    terms: 'Payment due within 30 days'
  })

  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 10 }
  ])

  const customerOptions = [
    { value: '1', label: 'ABC Corporation' },
    { value: '2', label: 'XYZ Industries' },
    { value: '3', label: 'Tech Innovations LLC' },
  ]

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, taxRate: 10 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = lineItems.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unitPrice
      return sum + (lineTotal * item.taxRate / 100)
    }, 0)
    const total = subtotal + taxAmount
    
    return { subtotal, taxAmount, total }
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement create invoice logic
    console.log('Creating invoice:', { formData, lineItems, totals: { subtotal, taxAmount, total } })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Customer"
          name="customerId"
          value={formData.customerId}
          onChange={(e) => setFormData({...formData, customerId: e.target.value})}
          options={customerOptions}
          placeholder="Select customer"
          required
        />
        <Input
          label="Invoice Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required
        />
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          required
        />
      </div>

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
              <div className="col-span-4">
                <Input
                  label={index === 0 ? "Description" : ""}
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label={index === 0 ? "Quantity" : ""}
                  type="number"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="1.00"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label={index === 0 ? "Unit Price" : ""}
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label={index === 0 ? "Tax Rate %" : ""}
                  type="number"
                  step="0.01"
                  value={item.taxRate}
                  onChange={(e) => updateLineItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                  placeholder="10.00"
                />
              </div>
              <div className="col-span-2">
                <div className="text-right">
                  {index === 0 && <label className="form-label">Line Total</label>}
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice * (1 + item.taxRate / 100))}
                  </p>
                </div>
                {lineItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                    className="mt-1"
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
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tax Amount:</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Additional notes for the customer"
        />
        <Input
          label="Terms & Conditions"
          value={formData.terms}
          onChange={(e) => setFormData({...formData, terms: e.target.value})}
          placeholder="Payment terms and conditions"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary">
          Save as Draft
        </Button>
        <Button type="submit" variant="primary">
          Create & Send
        </Button>
      </div>
    </form>
  )
}

// Helper function for status colors (duplicate from main component)
function getStatusColor(status: string) {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-800'
    case 'SENT': return 'bg-blue-100 text-blue-800'
    case 'VIEWED': return 'bg-purple-100 text-purple-800'
    case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
    case 'PAID': return 'bg-green-100 text-green-800'
    case 'OVERDUE': return 'bg-red-100 text-red-800'
    case 'CANCELLED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}