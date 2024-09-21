import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const salesData = await prisma.purchase_History.findMany({
    select: {
      Sale_Date: true,
      Total_Price: true,
    },
  })

  return NextResponse.json(salesData)
}
