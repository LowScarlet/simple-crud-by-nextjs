'use client'

import fetcher from "@/lib/fetcher";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

// Alternative approach using Prisma types:
type SimpananWithRelations = Prisma.SimpananGetPayload<{
  include: {
    Anggota: true;
    KategoriSimpanan: true;
  }
}>;

export const useGetAllSimpanan = () => {
  const { data, error, isLoading } = useSWR<SimpananWithRelations[]>
  ('/api/simpanan', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniqueSimpanan = (id: number) => {
  const { data, error, isLoading } = useSWR<SimpananWithRelations>
  ('/api/simpanan/' + id, fetcher);

  return { data, isLoading, isError: error };
};