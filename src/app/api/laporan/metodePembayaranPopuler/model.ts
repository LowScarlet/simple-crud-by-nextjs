'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type MetodePembayaranPopuler = Prisma.MetodePembayaranGetPayload<{
  include: {
    _count: {
      select: { PembayaranPinjaman: true },
    },
  },
}>;

export const useMetodePembayaranPopuler = () => {
  const { data, error, isLoading } = useSWR<MetodePembayaranPopuler[]>('/api/laporan/metodePembayaranPopuler', fetcher);

  return { data, isLoading, isError: error };
};