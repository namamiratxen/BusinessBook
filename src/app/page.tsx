import { Building2, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">BusinessBook</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Modern ERP for
            <span className="text-primary-600 block">Growing Businesses</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your accounting, manage finances, and grow your business with our 
            comprehensive ERP solution. Built for the modern age with enterprise-grade security.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <Building2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">General Ledger</h3>
            <p className="text-gray-600">Complete chart of accounts, journal entries, and financial reporting</p>
          </div>
          
          <div className="card text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Tenant</h3>
            <p className="text-gray-600">Secure multi-tenant architecture with role-based access control</p>
          </div>
          
          <div className="card text-center">
            <DollarSign className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AP & AR Management</h3>
            <p className="text-gray-600">Streamlined accounts payable and receivable with automated workflows</p>
          </div>
          
          <div className="card text-center">
            <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-600">Real-time financial insights with customizable reports and dashboards</p>
          </div>
        </div>

        {/* Subscription Tiers Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Individual</h3>
              <p className="text-gray-600 mb-4">Perfect for freelancers and solo entrepreneurs</p>
              <div className="text-2xl font-bold text-primary-600 mb-4">$9/month</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Basic ledger management</li>
                <li>• Income/expense tracking</li>
                <li>• Simple reporting</li>
              </ul>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow border-primary-200 border-2">
              <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Small Business</h3>
              <p className="text-gray-600 mb-4">Complete accounting for growing businesses</p>
              <div className="text-2xl font-bold text-primary-600 mb-4">$29/month</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Full AP/AR management</li>
                <li>• Multi-user access</li>
                <li>• Bank reconciliation</li>
                <li>• Advanced reporting</li>
              </ul>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">Advanced features for large organizations</p>
              <div className="text-2xl font-bold text-primary-600 mb-4">$99/month</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-currency support</li>
                <li>• Advanced workflows</li>
                <li>• Audit trails</li>
                <li>• Custom integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 BusinessBook ERP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}