'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type AnggotaCicilanTerbanyak = Prisma.AnggotaGetPayload<{
  include: {
    _count: {
      select: {
        PembayaranPinjaman: true
      }
    },
  },
}>;

export const useAnggotaCicilanTerbanyak = () => {
  const { data, error, isLoading } = useSWR<AnggotaCicilanTerbanyak[]>('/api/laporan/anggotaCicilanTerbanyak', fetcher);

  return { data, isLoading, isError: error };
};