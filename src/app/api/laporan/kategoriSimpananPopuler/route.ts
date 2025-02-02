import { NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  try {
    await delay(1000); // 1 second delay
    const data = await myPrisma.kategoriSimpanan.findMany({
      include: {
        _count: {
          select: { Simpanan: true },
        },
      },
      orderBy: {
        Simpanan: {
          _count: 'desc', 
        },
      },
    });
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}