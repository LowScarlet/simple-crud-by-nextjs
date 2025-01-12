'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

type PembayaranPinjamanWithRelations = Prisma.PembayaranPinjamanGetPayload<{
  include: {
    MetodePembayaran: true;
    Pinjaman: {
      include: {
        StatusPinjaman: true
      }
    };
    Anggota: true;
  }
}>;

export const useGetAllPembayaranPinjaman = () => {
  const { data, error, isLoading } = useSWR<PembayaranPinjamanWithRelations[]>
  ('/api/pembayaranPinjaman', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniquePembayaranPinjaman = (id: number) => {
  const { data, error, isLoading } = useSWR<PembayaranPinjamanWithRelations>
  ('/api/pembayaranPinjaman/' + id, fetcher);

  return { data, isLoading, isError: error };
};