import { PrismaClient, UserRole, AccountCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create default tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default',
      subscription: 'enterprise',
      isActive: true,
    },
  })

  console.log('Created default tenant:', defaultTenant.name)

  // Create default admin user
  const hashedPassword = await bcrypt.hash('password', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: defaultTenant.id,
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create additional demo users
  const demoUsers = [
    {
      email: 'ap@demo.com',
      firstName: 'AP',
      lastName: 'Manager',
      role: UserRole.AP_MANAGER,
    },
    {
      email: 'ar@demo.com',
      firstName: 'AR',
      lastName: 'Manager',
      role: UserRole.AR_MANAGER,
    },
    {
      email: 'accountant@demo.com',
      firstName: 'Staff',
      lastName: 'Accountant',
      role: UserRole.ACCOUNTANT,
    },
  ]

  for (const userData of demoUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        tenantId: defaultTenant.id,
      },
    })
  }

  console.log('Created demo users')

  // Create default company
  const defaultCompany = await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {},
    create: {
      id: 'default-company',
      name: 'Demo Company Ltd.',
      legalName: 'Demo Company Limited',
      email: 'info@democompany.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Street',
      city: 'Business City',
      state: 'BC',
      country: 'US',
      zipCode: '12345',
      baseCurrency: 'USD',
      tenantId: defaultTenant.id,
    },
  })

  console.log('Created default company:', defaultCompany.name)

  // Create account types
  const accountTypes = [
    {
      id: 'bank',
      name: 'Bank',
      category: AccountCategory.ASSET,
      normalSide: 'DEBIT',
      description: 'Bank and cash accounts',
    },
    {
      id: 'receivables',
      name: 'Accounts Receivable',
      category: AccountCategory.ASSET,
      normalSide: 'DEBIT',
      description: 'Money owed by customers',
    },
    {
      id: 'inventory',
      name: 'Inventory',
      category: AccountCategory.ASSET,
      normalSide: 'DEBIT',
      description: 'Goods for sale',
    },
    {
      id: 'fixed-assets',
      name: 'Fixed Assets',
      category: AccountCategory.ASSET,
      normalSide: 'DEBIT',
      description: 'Long-term assets',
    },
    {
      id: 'payables',
      name: 'Accounts Payable',
      category: AccountCategory.LIABILITY,
      normalSide: 'CREDIT',
      description: 'Money owed to vendors',
    },
    {
      id: 'credit-cards',
      name: 'Credit Cards',
      category: AccountCategory.LIABILITY,
      normalSide: 'CREDIT',
      description: 'Credit card liabilities',
    },
    {
      id: 'equity',
      name: 'Equity',
      category: AccountCategory.EQUITY,
      normalSide: 'CREDIT',
      description: 'Owner equity accounts',
    },
    {
      id: 'revenue',
      name: 'Revenue',
      category: AccountCategory.REVENUE,
      normalSide: 'CREDIT',
      description: 'Income accounts',
    },
    {
      id: 'cost-of-sales',
      name: 'Cost of Sales',
      category: AccountCategory.EXPENSE,
      normalSide: 'DEBIT',
      description: 'Direct costs',
    },
    {
      id: 'operating-expenses',
      name: 'Operating Expenses',
      category: AccountCategory.EXPENSE,
      normalSide: 'DEBIT',
      description: 'Operating expenses',
    },
  ]

  for (const typeData of accountTypes) {
    await prisma.accountType.upsert({
      where: { id: typeData.id },
      update: {},
      create: typeData,
    })
  }

  console.log('Created account types')

  // Create default chart of accounts
  const accounts = [
    {
      code: '1001',
      name: 'Cash - Checking Account',
      accountTypeId: 'bank',
      openingBalance: 25000.00,
      currentBalance: 25000.00,
    },
    {
      code: '1002',
      name: 'Cash - Savings Account',
      accountTypeId: 'bank',
      openingBalance: 15000.00,
      currentBalance: 15000.00,
    },
    {
      code: '1200',
      name: 'Accounts Receivable',
      accountTypeId: 'receivables',
      openingBalance: 8500.00,
      currentBalance: 8500.00,
    },
    {
      code: '1300',
      name: 'Inventory',
      accountTypeId: 'inventory',
      openingBalance: 12000.00,
      currentBalance: 12000.00,
    },
    {
      code: '1500',
      name: 'Equipment',
      accountTypeId: 'fixed-assets',
      openingBalance: 25000.00,
      currentBalance: 25000.00,
    },
    {
      code: '2001',
      name: 'Accounts Payable',
      accountTypeId: 'payables',
      openingBalance: 4200.00,
      currentBalance: 4200.00,
    },
    {
      code: '2100',
      name: 'Credit Card - Business',
      accountTypeId: 'credit-cards',
      openingBalance: 1500.00,
      currentBalance: 1500.00,
    },
    {
      code: '3001',
      name: 'Owner\'s Equity',
      accountTypeId: 'equity',
      openingBalance: 50000.00,
      currentBalance: 50000.00,
    },
    {
      code: '4001',
      name: 'Sales Revenue',
      accountTypeId: 'revenue',
      openingBalance: 0.00,
      currentBalance: 75000.00,
    },
    {
      code: '4010',
      name: 'Service Revenue',
      accountTypeId: 'revenue',
      openingBalance: 0.00,
      currentBalance: 25000.00,
    },
    {
      code: '5001',
      name: 'Cost of Goods Sold',
      accountTypeId: 'cost-of-sales',
      openingBalance: 0.00,
      currentBalance: 35000.00,
    },
    {
      code: '5010',
      name: 'Office Supplies',
      accountTypeId: 'operating-expenses',
      openingBalance: 0.00,
      currentBalance: 1200.00,
    },
    {
      code: '5020',
      name: 'Rent Expense',
      accountTypeId: 'operating-expenses',
      openingBalance: 0.00,
      currentBalance: 6000.00,
    },
    {
      code: '5030',
      name: 'Utilities',
      accountTypeId: 'operating-expenses',
      openingBalance: 0.00,
      currentBalance: 1800.00,
    },
  ]

  for (const accountData of accounts) {
    await prisma.account.upsert({
      where: { 
        companyId_code: {
          companyId: defaultCompany.id,
          code: accountData.code
        }
      },
      update: {},
      create: {
        ...accountData,
        companyId: defaultCompany.id,
      },
    })
  }

  console.log('Created default chart of accounts')

  // Create sample customers
  const customers = [
    {
      customerNumber: 'CUST001',
      name: 'ABC Corporation',
      contactPerson: 'John Smith',
      email: 'john@abccorp.com',
      phone: '+1 (555) 111-1111',
      billingAddress: '123 Customer St',
      city: 'Customer City',
      state: 'CC',
      zipCode: '11111',
      paymentTerms: 'NET_30',
      creditLimit: 10000.00,
    },
    {
      customerNumber: 'CUST002',
      name: 'XYZ Industries',
      contactPerson: 'Jane Doe',
      email: 'jane@xyzind.com',
      phone: '+1 (555) 222-2222',
      billingAddress: '456 Industry Ave',
      city: 'Industry Town',
      state: 'IT',
      zipCode: '22222',
      paymentTerms: 'NET_45',
      creditLimit: 15000.00,
    },
  ]

  for (const customerData of customers) {
    await prisma.customer.upsert({
      where: {
        companyId_customerNumber: {
          companyId: defaultCompany.id,
          customerNumber: customerData.customerNumber
        }
      },
      update: {},
      create: {
        ...customerData,
        companyId: defaultCompany.id,
      },
    })
  }

  console.log('Created sample customers')

  // Create sample vendors
  const vendors = [
    {
      vendorNumber: 'VEND001',
      name: 'Office Supplies Co',
      contactPerson: 'Mike Johnson',
      email: 'mike@officesupplies.com',
      phone: '+1 (555) 333-3333',
      billingAddress: '789 Supplier Blvd',
      city: 'Supplier City',
      state: 'SC',
      zipCode: '33333',
      paymentTerms: 'NET_30',
      creditLimit: 5000.00,
    },
    {
      vendorNumber: 'VEND002',
      name: 'Tech Equipment Ltd',
      contactPerson: 'Sarah Wilson',
      email: 'sarah@techequip.com',
      phone: '+1 (555) 444-4444',
      billingAddress: '321 Tech Park',
      city: 'Tech Valley',
      state: 'TV',
      zipCode: '44444',
      paymentTerms: 'NET_45',
      creditLimit: 20000.00,
    },
  ]

  for (const vendorData of vendors) {
    await prisma.vendor.upsert({
      where: {
        companyId_vendorNumber: {
          companyId: defaultCompany.id,
          vendorNumber: vendorData.vendorNumber
        }
      },
      update: {},
      create: {
        ...vendorData,
        companyId: defaultCompany.id,
      },
    })
  }

  console.log('Created sample vendors')

  // Create sample bank accounts
  const bankAccounts = [
    {
      accountName: 'Main Checking Account',
      accountNumber: '123456789',
      bankName: 'First National Bank',
      branchName: 'Downtown Branch',
      routingNumber: '021000021',
      accountType: 'CHECKING',
      currentBalance: 25000.00,
    },
    {
      accountName: 'Business Savings',
      accountNumber: '987654321',
      bankName: 'First National Bank',
      branchName: 'Downtown Branch',
      routingNumber: '021000021',
      accountType: 'SAVINGS',
      currentBalance: 15000.00,
    },
  ]

  for (const bankAccountData of bankAccounts) {
    await prisma.bankAccount.upsert({
      where: {
        companyId_accountNumber: {
          companyId: defaultCompany.id,
          accountNumber: bankAccountData.accountNumber
        }
      },
      update: {},
      create: {
        ...bankAccountData,
        companyId: defaultCompany.id,
      },
    })
  }

  console.log('Created sample bank accounts')

  // Create current financial period
  const currentYear = new Date().getFullYear()
  await prisma.financialPeriod.upsert({
    where: { id: 'current-period' },
    update: {},
    create: {
      id: 'current-period',
      name: `FY ${currentYear}`,
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      status: 'OPEN',
      companyId: defaultCompany.id,
    },
  })

  console.log('Created current financial period')

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })