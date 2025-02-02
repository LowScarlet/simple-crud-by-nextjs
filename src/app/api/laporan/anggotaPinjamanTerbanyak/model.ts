'use client'

import fetcher from "@/lib/fetcher";
import { Anggota } from "@prisma/client";
import useSWR from "swr";

export interface AnggotaPinjamanTerbanyak extends Anggota {
  totalPinjaman: number;
}

export const useAnggotaPinjamanTerbanyak = () => {
  const { data, error, isLoading } = useSWR<AnggotaPinjamanTerbanyak[]>('/api/laporan/anggotaPinjamanTerbanyak', fetcher);

  return { data, isLoading, isError: error };
};