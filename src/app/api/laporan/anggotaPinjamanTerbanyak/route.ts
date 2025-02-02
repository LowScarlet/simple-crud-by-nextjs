import { NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  try {
    await delay(1000);
    const data = await myPrisma.pinjaman.groupBy({
      by: ['anggotaId'],
      _sum: {
        jumlah: true
      },
      orderBy: {
        _sum: {
          jumlah: 'desc'
        }
      },
    });

    // Get detailed anggota information for each grouped result
    const detailedData = await Promise.all(
      data.map(async (item) => {
        const anggota = await myPrisma.anggota.findUnique({
          where: { id: item.anggotaId },
        });
        return { ...anggota, totalPinjaman: item._sum.jumlah };
      })); return NextResponse.json(detailedData, { status: 200 })
  } catch (error) { if (error instanceof Error) { return NextResponse.json({ message: error.message }, { status: 500 }) } return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 }) }
}