'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export type AnggotaWithRelations = Prisma.AnggotaGetPayload<{
  include: {
    Simpanan: true,
    Pinjaman: true
  }
}>;

export const useGetAllAnggota = () => {
  const { data, error, isLoading } = useSWR<AnggotaWithRelations[]>('/api/anggota', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniqueAnggota = (id: number) => {
  const { data, error, isLoading } = useSWR<AnggotaWithRelations>('/api/anggota' + `${id}`, fetcher);

  return { data, isLoading, isError: error };
};