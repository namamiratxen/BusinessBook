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
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Vendor {
  id: string
  vendorNumber: string
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

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      vendorNumber: 'VEND001',
      name: 'Office Supplies Co',
      contactPerson: 'Mike Johnson',
      email: 'mike@officesupplies.com',
      phone: '+1 (555) 333-3333',
      website: 'www.officesupplies.com',
      billingAddress: '789 Supplier Blvd',
      city: 'Supplier City',
      state: 'SC',
      country: 'US',
      zipCode: '33333',
      paymentTerms: 'NET_30',
      creditLimit: 5000.00,
      currentBalance: 245.30,
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      vendorNumber: 'VEND002',
      name: 'Tech Equipment Ltd',
      contactPerson: 'Sarah Wilson',
      email: 'sarah@techequip.com',
      phone: '+1 (555) 444-4444',
      website: 'www.techequipment.com',
      billingAddress: '321 Tech Park',
      city: 'Tech Valley',
      state: 'TV',
      country: 'US',
      zipCode: '44444',
      paymentTerms: 'NET_45',
      creditLimit: 20000.00,
      currentBalance: 0.00,
      isActive: true,
      createdAt: new Date('2024-01-03')
    },
    {
      id: '3',
      vendorNumber: 'VEND003',
      name: 'Utility Services Inc',
      contactPerson: 'Robert Brown',
      email: 'billing@utilityservices.com',
      phone: '+1 (555) 555-5555',
      website: 'www.utilityservices.com',
      billingAddress: '999 Service Road',
      city: 'Service Town',
      state: 'ST',
      country: 'US',
      zipCode: '55555',
      paymentTerms: 'NET_15',
      creditLimit: 2000.00,
      currentBalance: 189.45,
      isActive: true,
      createdAt: new Date('2024-01-08')
    }
  ])

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Vendors' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'outstanding', label: 'Outstanding Balance' },
  ]

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.vendorNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesStatus = true
    if (filterStatus === 'active') matchesStatus = vendor.isActive
    if (filterStatus === 'inactive') matchesStatus = !vendor.isActive
    if (filterStatus === 'outstanding') matchesStatus = vendor.currentBalance > 0
    
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'vendorNumber',
      label: 'Vendor #',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Vendor Name',
      render: (value: string, row: Vendor) => (
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
      render: (value: string, row: Vendor) => (
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
      label: 'Outstanding',
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
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

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setShowViewModal(true)
  }

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setShowEditModal(true)
  }

  const handleDelete = (vendor: Vendor) => {
    if (vendor.currentBalance > 0) {
      alert('Cannot delete vendor with outstanding balance')
      return
    }
    
    if (confirm(`Are you sure you want to delete vendor "${vendor.name}"?`)) {
      setVendors(vendors.filter(v => v.id !== vendor.id))
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
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600 mt-2">Manage your vendor database and accounts payable</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Vendor
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-green-600">
                {vendors.filter(v => v.isActive).length}
              </p>
            </div>
            <Building className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(vendors.reduce((sum, v) => sum + v.currentBalance, 0))}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Credit Available</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(vendors.reduce((sum, v) => sum + ((v.creditLimit || 0) - v.currentBalance), 0))}
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
                placeholder="Search vendors..."
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

      {/* Vendors Table */}
      <Table
        data={filteredVendors}
        columns={columns}
        loading={isLoading}
        actions={actions}
        onRowClick={handleView}
      />

      {/* Modals */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedVendor ? `Vendor - ${selectedVendor.name}` : 'Vendor Details'}
        size="lg"
      >
        {selectedVendor && <VendorDetailView vendor={selectedVendor} />}
      </Modal>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Vendor"
        size="lg"
      >
        <CreateVendorForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Vendor"
        size="lg"
      >
        {selectedVendor && (
          <EditVendorForm 
            vendor={selectedVendor}
            onClose={() => setShowEditModal(false)} 
          />
        )}
      </Modal>
    </DashboardLayout>
  )
}

// Vendor Detail View
function VendorDetailView({ vendor }: { vendor: Vendor }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Vendor #:</span> {vendor.vendorNumber}</div>
            <div><span className="text-gray-600">Company Name:</span> {vendor.name}</div>
            <div><span className="text-gray-600">Contact Person:</span> {vendor.contactPerson || '-'}</div>
            <div><span className="text-gray-600">Website:</span> {vendor.website || '-'}</div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              {vendor.email || 'No email'}
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              {vendor.phone || 'No phone'}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {vendor.billingAddress ? 
                `${vendor.billingAddress}, ${vendor.city}, ${vendor.state} ${vendor.zipCode}` :
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
                {formatCurrency(vendor.creditLimit || 0)}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Outstanding Balance</p>
              <p className="text-xl font-bold text-red-900">
                {formatCurrency(vendor.currentBalance)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Available Credit</p>
              <p className="text-xl font-bold text-green-900">
                {formatCurrency((vendor.creditLimit || 0) - vendor.currentBalance)}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recent Bills</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">BILL-2024-001</p>
              <p className="text-sm text-gray-600">Jan 14, 2024 • Due: Feb 13, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatCurrency(245.30)}</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">BILL-2024-002</p>
              <p className="text-sm text-gray-600">Jan 8, 2024 • Due: Feb 7, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatCurrency(1200.00)}</p>
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

// Create Vendor Form
function CreateVendorForm({ onClose }: { onClose: () => void }) {
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
    // TODO: Implement create vendor logic
    console.log('Creating vendor:', formData)
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
          placeholder="Office Supplies Co"
          required
        />
        <Input
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
          placeholder="Mike Johnson"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="contact@vendor.com"
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
        placeholder="www.vendor.com"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Billing Address"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
          placeholder="123 Vendor Street"
        />
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          placeholder="Vendor City"
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
          Vendor is active
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Vendor
        </Button>
      </div>
    </form>
  )
}

// Edit Vendor Form (similar to create but with existing data)
function EditVendorForm({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: vendor.name,
    contactPerson: vendor.contactPerson || '',
    email: vendor.email || '',
    phone: vendor.phone || '',
    website: vendor.website || '',
    billingAddress: vendor.billingAddress || '',
    city: vendor.city || '',
    state: vendor.state || '',
    country: vendor.country,
    zipCode: vendor.zipCode || '',
    paymentTerms: vendor.paymentTerms || 'NET_30',
    creditLimit: vendor.creditLimit || 0,
    isActive: vendor.isActive
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement update vendor logic
    console.log('Updating vendor:', formData)
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
          Vendor is active
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update Vendor
        </Button>
      </div>
    </form>
  )
}