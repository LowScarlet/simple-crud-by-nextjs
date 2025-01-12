import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function GET() {
  try {
    const data = await myPrisma.pembayaranPinjaman.findMany({
      include: {
        MetodePembayaran: true,
        Pinjaman: true,
        Anggota: true
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await myPrisma.pembayaranPinjaman.create({
      data: body,
      include: {
        MetodePembayaran: true,
        Pinjaman: true,
        Anggota: true
      }
    })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}