'use client'

import fetcher from "@/lib/fetcher";
import { Anggota } from "@prisma/client";
import useSWR from "swr";

export interface AnggotaSimpananTerbanyak extends Anggota {
  totalSimpanan: number;
}

export const useAnggotaSimpananTerbanyak = () => {
  const { data, error, isLoading } = useSWR<AnggotaSimpananTerbanyak[]>('/api/laporan/anggotaSimpananTerbanyak', fetcher);

  return { data, isLoading, isError: error };
};