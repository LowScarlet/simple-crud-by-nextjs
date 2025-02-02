'use client'

import fetcher from "@/lib/fetcher";
import { Anggota } from "@prisma/client";
import useSWR from "swr";

export const useAnggotaPerempuanTerdaftar = () => {
  const { data, error, isLoading } = useSWR<Anggota[]>('/api/laporan/anggotaPerempuanTerdaftar', fetcher);

  return { data, isLoading, isError: error };
};