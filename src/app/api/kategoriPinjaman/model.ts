'use client'

import fetcher from "@/lib/fetcher";
import { myPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export const useGetAllKategoriPinjaman = () => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.kategoriPinjaman.findMany>
  >('/api/kategoriPinjaman', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniqueKategoriPinjaman = (id: number) => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.kategoriPinjaman.findUnique>
  >('/api/kategoriPinjaman' + `${id}`, fetcher);

  return { data, isLoading, isError: error };
};