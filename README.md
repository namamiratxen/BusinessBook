# BusinessBook ERP - Phase 1

A modern, multi-tenant ERP software solution built with Next.js, TypeScript, and PostgreSQL. This is Phase 1 focusing on Core Accounting & Bookkeeping functionality.

## 🚀 Features (Phase 1)

### General Ledger (GL)
- Chart of Accounts (predefined + customizable)
- Journal Entry creation & posting
- Trial Balance, Balance Sheet, P&L reports
- Multi-currency support

### Accounts Payable (AP)
- Vendor master management
- Invoice recording & approval workflow
- Payment scheduling and processing
- Vendor aging reports

### Accounts Receivable (AR)
- Customer master management
- Invoice creation and management
- Receipt tracking
- Customer aging reports

### Bank & Cash Management
- Bank reconciliation
- Multi-bank account support
- Cash book management
- Payment processing

### Multi-Tenant Architecture
- Secure tenant isolation
- Role-Based Access Control (RBAC)
- Subscription-based feature access

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/namamiratxen/BusinessBook.git
   cd BusinessBook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local .env
   ```
   
   Update the following variables in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/businessbook_erp"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Create the database
   createdb businessbook_erp
   
   # Push the schema to the database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000)

## 👤 Demo Accounts

After seeding the database, you can use these demo accounts:

- **Super Admin**: `admin@demo.com` / `password`
- **AP Manager**: `ap@demo.com` / `password`
- **AR Manager**: `ar@demo.com` / `password`
- **Accountant**: `accountant@demo.com` / `password`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── accounts/          # Chart of accounts, journal entries
│   ├── accounting/        # User management, settings
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── utils/                # Helper functions

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding script
```

## 🎯 Roadmap

### Phase 1 - Core Accounting (Current)
- ✅ Project Setup & Architecture
- ✅ Multi-tenant Database Schema
- ✅ User Interface Foundation
- 🔄 Authentication & RBAC
- 🔄 General Ledger Module
- ⏳ Accounts Payable Module
- ⏳ Accounts Receivable Module
- ⏳ Bank & Cash Management

### Phase 2 - Advanced Accounting
- Advanced reporting
- Financial consolidation
- Multi-currency transactions
- Audit trails

### Phase 3 - Inventory Management
- Stock management
- Purchase orders
- Sales orders

### Phase 4 - CRM Integration
- Customer relationship management
- Sales pipeline
- Marketing automation

## 🔐 Security Features

- Multi-tenant data isolation
- Role-based access control (RBAC)
- Encrypted passwords
- Audit logging
- Session management

## 🌍 Multi-Tenant Support

The application supports multiple organizations with complete data isolation:
- Tenant-specific user management
- Isolated financial data
- Subscription-based feature access
- Custom branding per tenant

## 📊 Subscription Tiers

1. **Individual** ($9/month) - Basic ledger + reports
2. **Team** ($19/month) - Add AP/AR + multi-user
3. **Small Business** ($29/month) - Bank reconciliation + advanced features
4. **Enterprise** ($99/month) - Full features + integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ for modern businesses by the BusinessBook team.