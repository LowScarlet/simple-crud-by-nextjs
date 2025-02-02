'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type AnggotaCicilanTerbanyak = Prisma.AnggotaGetPayload<{
  include: {
    PembayaranPinjaman: true
  }
}>;

export const useGetAllAnggota = () => {
  const { data, error, isLoading } = useSWR<AnggotaCicilanTerbanyak[]>('/api/laporan/anggotaCicilanTerbanyak', fetcher);

  return { data, isLoading, isError: error };
};