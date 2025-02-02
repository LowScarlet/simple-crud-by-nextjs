import { NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  try {
    await delay(1000);
    const data = await myPrisma.anggota.findMany({
      include: {
        _count: {
          select: {
            PembayaranPinjaman: true
          }
        },
      },
      orderBy: {
        PembayaranPinjaman: {
          _count: 'desc'
        }
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