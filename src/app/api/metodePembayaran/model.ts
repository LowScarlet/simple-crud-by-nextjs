'use client'

import fetcher from "@/lib/fetcher";
import { myPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

export const useGetAllMetodePembayaran = () => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.metodePembayaran.findMany>
  >('/api/metodePembayaran', fetcher);

  return { data, isLoading, isError: error };
};

export const useGetUniqueMetodePembayaran = (id: number) => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.metodePembayaran.findUnique>
  >('/api/metodePembayaran' + `${id}`, fetcher);

  return { data, isLoading, isError: error };
};