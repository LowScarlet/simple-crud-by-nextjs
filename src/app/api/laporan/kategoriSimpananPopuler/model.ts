'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type KategoriPinjamanPopuler = Prisma.KategoriPinjamanGetPayload<{
  include: {
    _count: {
      select: { Pinjaman: true },
    },
  },
}>;

export const useKategoriPinjamanPopuler = () => {
  const { data, error, isLoading } = useSWR<KategoriPinjamanPopuler[]>('/api/laporan/kategoriSimpananPopuler', fetcher);

  return { data, isLoading, isError: error };
};