'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Building2, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Receipt,
  Banknote,
  Calculator
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: SidebarItem[]
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounting',
    icon: BookOpen,
    children: [
      {
        title: 'General Settings',
        href: '/accounting/general',
        icon: Settings,
      },
      {
        title: 'Users & Access',
        href: '/accounting/users',
        icon: Users,
      },
      {
        title: 'Finance Periods',
        href: '/accounting/periods',
        icon: Calendar,
      },
      {
        title: 'Regions',
        href: '/accounting/regions',
        icon: MapPin,
      },
      {
        title: 'Actions',
        href: '/accounting/actions',
        icon: Zap,
      },
      {
        title: 'Added Value',
        href: '/accounting/added-value',
        icon: Plus,
      },
      {
        title: 'Currencies',
        href: '/accounting/currencies',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'Basic Information',
    icon: FileText,
    children: [
      {
        title: 'Chart of Accounts',
        href: '/accounts/chart',
        icon: Calculator,
      },
      {
        title: 'Journal Entries',
        href: '/accounts/journal',
        icon: BookOpen,
      },
      {
        title: 'Trial Balance',
        href: '/accounts/trial-balance',
        icon: PieChart,
      },
    ],
  },
  {
    title: 'Liquidity',
    icon: Banknote,
    children: [
      {
        title: 'Bank Accounts',
        href: '/banking/accounts',
        icon: CreditCard,
      },
      {
        title: 'Bank Reconciliation',
        href: '/banking/reconciliation',
        icon: Receipt,
      },
      {
        title: 'Cash Management',
        href: '/banking/cash',
        icon: Banknote,
      },
    ],
  },
  {
    title: 'Stocks',
    icon: Package,
    children: [
      {
        title: 'Inventory Items',
        href: '/inventory/items',
        icon: Package,
      },
      {
        title: 'Stock Movements',
        href: '/inventory/movements',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Sales',
    icon: ShoppingCart,
    children: [
      {
        title: 'Customers',
        href: '/sales/customers',
        icon: Users,
      },
      {
        title: 'Invoices',
        href: '/sales/invoices',
        icon: FileText,
      },
      {
        title: 'Receipts',
        href: '/sales/receipts',
        icon: Receipt,
      },
    ],
  },
  {
    title: 'Productions',
    icon: Settings,
    href: '/productions',
  },
  {
    title: 'Quality Control',
    icon: CheckCircle,
    href: '/quality-control',
  },
  {
    title: 'Trades',
    icon: TrendingUp,
    href: '/trades',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

// Additional imports needed
import { Calendar, MapPin, Zap, Plus, CheckCircle } from 'lucide-react'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Accounting', 'Basic Information'])

  const toggleExpanded = (title: string) => {
    if (isCollapsed) return
    
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href)
  }

  const isParentActive = (children?: SidebarItem[]) => {
    if (!children) return false
    return children.some(child => isActive(child.href))
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const itemIsActive = isActive(item.href) || isParentActive(item.children)

    return (
      <div key={item.title}>
        {item.href ? (
          <Link
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              level > 0 ? 'ml-6 pl-6 border-l border-gray-200' : '',
              itemIsActive
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon className={cn('h-5 w-5', level > 0 ? 'h-4 w-4' : '', isCollapsed ? 'mr-0' : 'mr-3')} />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              'w-full flex items-center px-3 py-2 text-sm font-medium text-left rounded-md transition-colors duration-200',
              level > 0 ? 'ml-6 pl-6 border-l border-gray-200' : '',
              itemIsActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon className={cn('h-5 w-5', level > 0 ? 'h-4 w-4' : '', isCollapsed ? 'mr-0' : 'mr-3')} />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {hasChildren && (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                )}
              </>
            )}
          </button>
        )}
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center px-3 py-4 border-b border-gray-200">
        <Building2 className="h-8 w-8 text-primary-600" />
        {!isCollapsed && (
          <span className="ml-3 text-xl font-bold text-gray-900">BusinessBook</span>
        )}
      </div>
      
      <nav className="mt-4 px-2 space-y-1 overflow-y-auto">
        {sidebarItems.map(item => renderSidebarItem(item))}
      </nav>
    </div>
  )
}