'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type TotalStatusPinjaman = Prisma.StatusPinjamanGetPayload<{
  include: {
    _count: {
      select: { Pinjaman: true },
    },
  },
}>;

export const useTotalStatusPinjaman = () => {
  const { data, error, isLoading } = useSWR<TotalStatusPinjaman[]>('/api/laporan/totalStatusPinjaman', fetcher);

  return { data, isLoading, isError: error };
};