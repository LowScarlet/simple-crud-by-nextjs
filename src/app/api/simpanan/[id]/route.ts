import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const data = await myPrisma.simpanan.findUnique({
      where: { id: Number(params.id) },
      include: {
        Anggota: true,
        KategoriSimpanan: true
      }
    })
    
    if (!data) {
      return NextResponse.json(
        { message: '404' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const body = await req.json()
    const data = await myPrisma.simpanan.update({
      where: { id: Number(params.id) },
      data: body,
      include: {
        Anggota: true,
        KategoriSimpanan: true
      }
    })
    
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const data = await myPrisma.simpanan.delete({
      where: { id: Number(params.id) }
    })
    
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}