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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  MessageSquare,
  UserCheck
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  fullName: string
  username: string
  email: string
  role: string
  department?: string
  expireDate: string
  status: 'Active' | 'Deactivated'
  condition: 'Online' | 'Offline'
  avatar?: string
}

export default function UsersAccessPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      fullName: 'Alexander Medvedev',
      username: 'A.Medvedev',
      email: 'a.medvedev@company.com',
      role: 'Sales Man, Accountant',
      expireDate: '2029/12/30',
      status: 'Deactivated',
      condition: 'Offline',
      avatar: '/avatars/alexander.jpg'
    },
    {
      id: '2',
      fullName: 'Marques Brownley',
      username: 'M.Brownley',
      email: 'm.brownley@company.com',
      role: 'Data Analyst',
      expireDate: '2029/12/30',
      status: 'Active',
      condition: 'Online',
      avatar: '/avatars/marques.jpg'
    },
    {
      id: '3',
      fullName: 'Anastasia Golovko',
      username: 'A.Golovko',
      email: 'a.golovko@company.com',
      role: 'Stock Accountant',
      expireDate: '2029/12/30',
      status: 'Active',
      condition: 'Online',
      avatar: '/avatars/anastasia.jpg'
    },
    {
      id: '4',
      fullName: 'Faizur Rehman',
      username: 'F.Rehman',
      email: 'f.rehman@company.com',
      role: 'Sale Expert',
      expireDate: '2029/12/30',
      status: 'Active',
      condition: 'Online',
      avatar: '/avatars/faizur.jpg'
    },
    {
      id: '5',
      fullName: 'Emily Lynch',
      username: 'S.Parkinson',
      email: 'e.lynch@gmail.com',
      role: 'Production Line Expert',
      expireDate: '2029/12/30',
      status: 'Deactivated',
      condition: 'Offline',
      avatar: '/avatars/emily.jpg'
    },
    {
      id: '6',
      fullName: 'Kamila Harris',
      username: 'K.Harris',
      email: 'k.harris@company.com',
      role: 'R&D Expert',
      expireDate: '2029/12/30',
      status: 'Active',
      condition: 'Online',
      avatar: '/avatars/kamila.jpg'
    }
  ])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Deactivated', label: 'Deactivated' },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'fullName',
      label: 'Full Name',
      render: (value: string, row: User) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {value.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      label: 'Username',
    },
    {
      key: 'expireDate',
      label: 'Expire Date',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'condition',
      label: 'Condition',
      render: (value: string) => (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            value === 'Online' ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-700">{value}</span>
        </div>
      ),
    },
  ]

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
    setShowUserDetail(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    // Open edit modal
  }

  const handleDelete = (user: User) => {
    if (confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
      setUsers(users.filter(u => u.id !== user.id))
    }
  }

  const handleRowSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    )
  }

  const actions = [
    {
      label: 'View Details',
      onClick: (user: User) => handleRowClick(user),
      variant: 'primary' as const
    },
    {
      label: 'Edit Item',
      onClick: handleEdit,
      variant: 'secondary' as const
    },
    {
      label: 'Delete Item',
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
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <span>Basic Information</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Users & Access</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users & Access List</h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedUsers.length > 0 && `${selectedUsers.length} Users selected`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {/* Filter icon */}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New User
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in list"
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
        </div>
      </Card>

      {/* Users Table */}
      <Table
        data={filteredUsers}
        columns={columns}
        loading={isLoading}
        actions={actions}
        onRowClick={handleRowClick}
        selectedRows={selectedUsers}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
      />

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserDetail}
        onClose={() => setShowUserDetail(false)}
        title="User Detail"
        size="lg"
      >
        {selectedUser && <UserDetailView user={selectedUser} />}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <CreateUserForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </DashboardLayout>
  )
}

// User Detail View Component (matches the design from screenshots)
function UserDetailView({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-300 p-6 rounded-lg text-white relative">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              {user.fullName}
              <UserCheck className="ml-2 h-6 w-6" />
            </h2>
            <p className="text-purple-100">{user.role}</p>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Task
          </Button>
          <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">E-mail</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <p className="text-gray-900">(616) 396-8484</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Address</label>
            <p className="text-gray-900">
              84 E 8th St - Town Holland - Michigan - 49423 - United States
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emily's upcoming tasks</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div>
              <p className="font-medium text-gray-900">Sign the upcoming contract</p>
              <p className="text-sm text-gray-600">Due date: Tue, Feb 13, 2024</p>
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
            <div>
              <p className="font-medium text-gray-900">Confirm the personnel payments</p>
              <p className="text-sm text-gray-600">Due date: Thu, Feb 15, 2024</p>
            </div>
            <span className="text-xs text-gray-500">Feb 15</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div>
              <p className="font-medium text-gray-900">Check the cargo's arrival</p>
              <p className="text-sm text-gray-600">Due date: Tue, Feb 13, 2024</p>
            </div>
            <span className="text-xs text-gray-500">Feb 15</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button variant="outline">
          Item History
        </Button>
        <Button variant="outline">
          Duplicate
        </Button>
        <Button variant="primary">
          Set as Admin
        </Button>
        <Button variant="outline">
          Edit Item
        </Button>
        <Button variant="danger">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Item
        </Button>
      </div>
    </div>
  )
}

// Create User Form Component
function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: 'USER',
    department: '',
    password: '',
    confirmPassword: '',
    expireDate: '2029-12-30',
    isActive: true
  })

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'AP_MANAGER', label: 'AP Manager' },
    { value: 'AP_CLERK', label: 'AP Clerk' },
    { value: 'AR_MANAGER', label: 'AR Manager' },
    { value: 'AR_CLERK', label: 'AR Clerk' },
    { value: 'ACCOUNTANT', label: 'Accountant' },
    { value: 'FINANCE_MANAGER', label: 'Finance Manager' },
    { value: 'USER', label: 'User' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement create user logic
    console.log('Creating user:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          placeholder="John"
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          placeholder="Doe"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="john@company.com"
          required
        />
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          placeholder="J.Doe"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          options={roleOptions}
          required
        />
        <Input
          label="Department"
          name="department"
          value={formData.department}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
          placeholder="Accounting"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          placeholder="Create password"
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          placeholder="Confirm password"
          required
        />
      </div>

      <Input
        label="Access Expiry Date"
        type="date"
        name="expireDate"
        value={formData.expireDate}
        onChange={(e) => setFormData({...formData, expireDate: e.target.value})}
        required
      />

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
          User is active
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create User
        </Button>
      </div>
    </form>
  )
}