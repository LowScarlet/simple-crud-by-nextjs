'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type KategoriSimpananPopuler = Prisma.KategoriSimpananGetPayload<{
  include: {
    _count: {
      select: { Simpanan: true },
    },
  },
}>;

export const useSimpananPinjamanPopuler = () => {
  const { data, error, isLoading } = useSWR<KategoriSimpananPopuler[]>('/api/laporan/kategoriPinjamanPopuler', fetcher);

  return { data, isLoading, isError: error };
};