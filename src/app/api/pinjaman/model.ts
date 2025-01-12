'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

type PinjamanWithRelations = Prisma.PinjamanGetPayload<{
  include: {
    Anggota: true;
    KategoriPinjaman: true;
    StatusPinjaman: true;
    PembayaranPinjaman: true;
  }
}>;

export const useGetAllPinjaman = () => {
  const { data, error, isLoading } = useSWR<PinjamanWithRelations[]>
  ('/api/pinjaman', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniquePinjaman = (id: number) => {
  const { data, error, isLoading } = useSWR<PinjamanWithRelations>
  ('/api/pinjaman/' + id, fetcher);

  return { data, isLoading, isError: error };
};