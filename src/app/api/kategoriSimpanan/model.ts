'use client'

import fetcher from "@/lib/fetcher";
import { myPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export const useGetAllKategoriSimpanan = () => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.kategoriSimpanan.findMany>
  >('/api/kategoriSimpanan', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniqueKategoriSimpanan = (id: number) => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.kategoriSimpanan.findUnique>
  >('/api/kategoriSimpanan' + `${id}`, fetcher);

  return { data, isLoading, isError: error };
};