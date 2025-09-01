import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/accounts - Fetch all accounts for a company
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId') || 'default-company'

    const accounts = await prisma.account.findMany({
      where: { 
        companyId,
        isActive: true 
      },
      include: {
        accountType: true
      },
      orderBy: {
        code: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: accounts
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch accounts' 
      },
      { status: 500 }
    )
  }
}

// POST /api/accounts - Create a new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      code, 
      name, 
      description, 
      accountTypeId, 
      parentAccountId, 
      openingBalance, 
      companyId 
    } = body

    // Check if account code already exists
    const existingAccount = await prisma.account.findUnique({
      where: {
        companyId_code: {
          companyId: companyId || 'default-company',
          code
        }
      }
    })

    if (existingAccount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account code already exists' 
        },
        { status: 400 }
      )
    }

    const account = await prisma.account.create({
      data: {
        code,
        name,
        description,
        accountTypeId,
        parentAccountId,
        openingBalance: parseFloat(openingBalance) || 0,
        currentBalance: parseFloat(openingBalance) || 0,
        companyId: companyId || 'default-company'
      },
      include: {
        accountType: true
      }
    })

    return NextResponse.json({
      success: true,
      data: account,
      message: 'Account created successfully'
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create account' 
      },
      { status: 500 }
    )
  }
}