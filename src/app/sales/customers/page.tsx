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
  Users,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Eye
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Customer {
  id: string
  customerNumber: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  billingAddress?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  paymentTerms?: string
  creditLimit?: number
  currentBalance: number
  isActive: boolean
  createdAt: Date
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      customerNumber: 'CUST001',
      name: 'ABC Corporation',
      contactPerson: 'John Smith',
      email: 'john@abccorp.com',
      phone: '+1 (555) 111-1111',
      website: 'www.abccorp.com',
      billingAddress: '123 Customer St',
      city: 'Customer City',
      state: 'CC',
      country: 'US',
      zipCode: '11111',
      paymentTerms: 'NET_30',
      creditLimit: 10000.00,
      currentBalance: 2500.00,
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      customerNumber: 'CUST002',
      name: 'XYZ Industries',
      contactPerson: 'Jane Doe',
      email: 'jane@xyzind.com',
      phone: '+1 (555) 222-2222',
      website: 'www.xyzindustries.com',
      billingAddress: '456 Industry Ave',
      city: 'Industry Town',
      state: 'IT',
      country: 'US',
      zipCode: '22222',
      paymentTerms: 'NET_45',
      creditLimit: 15000.00,
      currentBalance: 0.00,
      isActive: true,
      createdAt: new Date('2024-01-05')
    },
    {
      id: '3',
      customerNumber: 'CUST003',
      name: 'Tech Innovations LLC',
      contactPerson: 'Mike Johnson',
      email: 'mike@techinnovations.com',
      phone: '+1 (555) 333-3333',
      website: 'www.techinnovations.com',
      billingAddress: '789 Tech Park',
      city: 'Silicon Valley',
      state: 'CA',
      country: 'US',
      zipCode: '94000',
      paymentTerms: 'NET_15',
      creditLimit: 25000.00,
      currentBalance: 5750.00,
      isActive: true,
      createdAt: new Date('2024-01-10')
    }
  ])

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Customers' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'overdue', label: 'Overdue' },
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesStatus = true
    if (filterStatus === 'active') matchesStatus = customer.isActive
    if (filterStatus === 'inactive') matchesStatus = !customer.isActive
    if (filterStatus === 'overdue') matchesStatus = customer.currentBalance > 0
    
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'customerNumber',
      label: 'Customer #',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Customer Name',
      render: (value: string, row: Customer) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.contactPerson && (
            <div className="text-sm text-gray-500">{row.contactPerson}</div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value: string, row: Customer) => (
        <div className="space-y-1">
          {value && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-3 w-3 mr-1" />
              {value}
            </div>
          )}
          {row.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-3 w-3 mr-1" />
              {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      render: (value: string) => value || 'NET_30',
    },
    {
      key: 'creditLimit',
      label: 'Credit Limit',
      render: (value: number) => formatCurrency(value || 0),
      className: 'text-right',
      sortable: true,
    },
    {
      key: 'currentBalance',
      label: 'Current Balance',
      render: (value: number) => (
        <span className={value > 0 ? 'text-orange-600 font-medium' : 'text-gray-900'}>
          {formatCurrency(value)}
        </span>
      ),
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

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowViewModal(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowEditModal(true)
  }

  const handleDelete = (customer: Customer) => {
    if (customer.currentBalance > 0) {
      alert('Cannot delete customer with outstanding balance')
      return
    }
    
    if (confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
      setCustomers(customers.filter(c => c.id !== customer.id))
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
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-2">Manage your customer database and accounts receivable</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.isActive).length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(customers.reduce((sum, c) => sum + c.currentBalance, 0))}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Credit Limit</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(customers.reduce((sum, c) => sum + (c.creditLimit || 0), 0))}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
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
                placeholder="Search customers..."
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

      {/* Customers Table */}
      <Table
        data={filteredCustomers}
        columns={columns}
        loading={isLoading}
        actions={actions}
        onRowClick={handleView}
      />

      {/* Modals */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedCustomer ? `Customer - ${selectedCustomer.name}` : 'Customer Details'}
        size="lg"
      >
        {selectedCustomer && <CustomerDetailView customer={selectedCustomer} />}
      </Modal>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Customer"
        size="lg"
      >
        <CreateCustomerForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
        size="lg"
      >
        {selectedCustomer && (
          <EditCustomerForm 
            customer={selectedCustomer}
            onClose={() => setShowEditModal(false)} 
          />
        )}
      </Modal>
    </DashboardLayout>
  )
}

// Customer Detail View
function CustomerDetailView({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Customer #:</span> {customer.customerNumber}</div>
            <div><span className="text-gray-600">Company Name:</span> {customer.name}</div>
            <div><span className="text-gray-600">Contact Person:</span> {customer.contactPerson || '-'}</div>
            <div><span className="text-gray-600">Website:</span> {customer.website || '-'}</div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              {customer.email || 'No email'}
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              {customer.phone || 'No phone'}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {customer.billingAddress ? 
                `${customer.billingAddress}, ${customer.city}, ${customer.state} ${customer.zipCode}` :
                'No address'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Credit Limit</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(customer.creditLimit || 0)}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Current Balance</p>
              <p className="text-xl font-bold text-orange-900">
                {formatCurrency(customer.currentBalance)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Available Credit</p>
              <p className="text-xl font-bold text-green-900">
                {formatCurrency((customer.creditLimit || 0) - customer.currentBalance)}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recent Invoices</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">INV-2024-001</p>
              <p className="text-sm text-gray-600">Jan 10, 2024 • Due: Feb 10, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatCurrency(2500.00)}</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">INV-2024-002</p>
              <p className="text-sm text-gray-600">Jan 5, 2024 • Due: Feb 5, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatCurrency(1800.00)}</p>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Paid
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Create Customer Form
function CreateCustomerForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    billingAddress: '',
    city: '',
    state: '',
    country: 'US',
    zipCode: '',
    paymentTerms: 'NET_30',
    creditLimit: 0,
    isActive: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement create customer logic
    console.log('Creating customer:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Company Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="ABC Corporation"
          required
        />
        <Input
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
          placeholder="John Smith"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="contact@company.com"
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <Input
        label="Website"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData({...formData, website: e.target.value})}
        placeholder="www.company.com"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Billing Address"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
          placeholder="123 Business Street"
        />
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          placeholder="Business City"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={(e) => setFormData({...formData, state: e.target.value})}
          placeholder="CA"
        />
        <Select
          label="Country"
          name="country"
          value={formData.country}
          onChange={(e) => setFormData({...formData, country: e.target.value})}
          options={[
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'AU', label: 'Australia' },
          ]}
        />
        <Input
          label="ZIP Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
          placeholder="12345"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Payment Terms"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
          options={[
            { value: 'NET_15', label: 'Net 15 days' },
            { value: 'NET_30', label: 'Net 30 days' },
            { value: 'NET_45', label: 'Net 45 days' },
            { value: 'NET_60', label: 'Net 60 days' },
            { value: 'COD', label: 'Cash on Delivery' },
          ]}
        />
        <Input
          label="Credit Limit"
          type="number"
          step="0.01"
          name="creditLimit"
          value={formData.creditLimit}
          onChange={(e) => setFormData({...formData, creditLimit: parseFloat(e.target.value) || 0})}
          placeholder="0.00"
        />
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Customer is active
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Customer
        </Button>
      </div>
    </form>
  )
}

// Edit Customer Form
function EditCustomerForm({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: customer.name,
    contactPerson: customer.contactPerson || '',
    email: customer.email || '',
    phone: customer.phone || '',
    website: customer.website || '',
    billingAddress: customer.billingAddress || '',
    city: customer.city || '',
    state: customer.state || '',
    country: customer.country,
    zipCode: customer.zipCode || '',
    paymentTerms: customer.paymentTerms || 'NET_30',
    creditLimit: customer.creditLimit || 0,
    isActive: customer.isActive
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement update customer logic
    console.log('Updating customer:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Same form fields as CreateCustomerForm but populated with existing data */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Company Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Payment Terms"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
          options={[
            { value: 'NET_15', label: 'Net 15 days' },
            { value: 'NET_30', label: 'Net 30 days' },
            { value: 'NET_45', label: 'Net 45 days' },
            { value: 'NET_60', label: 'Net 60 days' },
          ]}
        />
        <Input
          label="Credit Limit"
          type="number"
          step="0.01"
          name="creditLimit"
          value={formData.creditLimit}
          onChange={(e) => setFormData({...formData, creditLimit: parseFloat(e.target.value) || 0})}
        />
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Customer is active
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update Customer
        </Button>
      </div>
    </form>
  )
}