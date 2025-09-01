'use client'

import { useState } from 'react'
import { Menu, X, Bell, Search, User, LogOut } from 'lucide-react'
import Sidebar from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  title: string
  href: string
  isActive: boolean
  isClosable: boolean
}

interface DashboardLayoutProps {
  children: React.ReactNode
  currentUser?: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

export default function DashboardLayout({ children, currentUser }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'dashboard', title: 'Dashboard', href: '/dashboard', isActive: true, isClosable: false }
  ])
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const closeTab = (tabId: string) => {
    if (tabId === 'dashboard') return // Dashboard tab is not closable
    
    const updatedTabs = tabs.filter(tab => tab.id !== tabId)
    
    // If the closed tab was active, activate the previous tab
    const closedTabIndex = tabs.findIndex(tab => tab.id === tabId)
    const wasActive = tabs[closedTabIndex]?.isActive
    
    if (wasActive && updatedTabs.length > 0) {
      const newActiveIndex = Math.max(0, closedTabIndex - 1)
      updatedTabs[newActiveIndex].isActive = true
    }
    
    setTabs(updatedTabs)
  }

  const switchTab = (tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })))
  }

  const addTab = (id: string, title: string, href: string) => {
    // Check if tab already exists
    const existingTab = tabs.find(tab => tab.id === id)
    if (existingTab) {
      switchTab(id)
      return
    }

    // Add new tab and make it active
    const newTab: Tab = { id, title, href, isActive: true, isClosable: true }
    setTabs(tabs.map(tab => ({ ...tab, isActive: false })).concat(newTab))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  {currentUser && (
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{currentUser.role}</div>
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Link>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {/* Handle logout */}}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center overflow-x-auto">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center border-r border-gray-200 last:border-r-0">
                <button
                  onClick={() => switchTab(tab.id)}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200',
                    tab.isActive
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {tab.title}
                </button>
                {tab.isClosable && (
                  <button
                    onClick={() => closeTab(tab.id)}
                    className="p-1 ml-1 mr-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}