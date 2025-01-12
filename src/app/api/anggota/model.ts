'use client'

import fetcher from "@/lib/fetcher";
import { myPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export const useGetAllAnggota = () => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.anggota.findMany>
  >('/api/anggota', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniqueAnggota = (id: number) => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.anggota.findUnique>
  >('/api/anggota' + `${id}`, fetcher);

  return { data, isLoading, isError: error };
};