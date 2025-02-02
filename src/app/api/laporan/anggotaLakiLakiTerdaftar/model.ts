'use client'

import fetcher from "@/lib/fetcher";
import { Anggota } from "@prisma/client";
import useSWR from "swr";

export const useAnggotaLakiLakiTerdaftar = () => {
  const { data, error, isLoading } = useSWR<Anggota[]>('/api/laporan/anggotaLakiLakiTerdaftar', fetcher);

  return { data, isLoading, isError: error };
};