#!/bin/bash

echo "🚀 Setting up BusinessBook ERP..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create database (optional - user should have this set up)
echo "📊 Database setup..."
echo "Please ensure your PostgreSQL database is running and update the DATABASE_URL in .env.local"
echo "Example: DATABASE_URL=\"postgresql://username:password@localhost:5432/businessbook_erp\""

# Push schema to database (commented out for safety)
echo "To complete database setup, run:"
echo "1. Update DATABASE_URL in .env.local"
echo "2. Run: npm run db:push"
echo "3. Run: npm run db:seed"

echo "🎉 Setup complete! Run 'npm run dev' to start the development server."
echo "📚 Visit http://localhost:3000 to access your ERP system"
echo ""
echo "🔐 Demo accounts after seeding:"
echo "   Super Admin: admin@demo.com / password"
echo "   AP Manager:  ap@demo.com / password"
echo "   AR Manager:  ar@demo.com / password"
echo "   Accountant:  accountant@demo.com / password"