import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    await delay(1000); // 1 second delay
    const data = await myPrisma.anggota.findUnique({
      where: { id: Number(params.id) }
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
    await delay(1000); // 1 second delay
    const body = await req.json()
    const data = await myPrisma.anggota.update({
      where: { id: Number(params.id) },
      data: body
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
    await delay(1000); // 1 second delay
    const data = await myPrisma.anggota.delete({
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