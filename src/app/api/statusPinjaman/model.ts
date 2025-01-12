'use client'

import fetcher from "@/lib/fetcher";
import { myPrisma } from "@/lib/prisma";
import { Prisma, StatusPinjaman } from "@prisma/client";
import useSWR from "swr";

export const useGetAllStatusPinjaman = () => {
  const { data, error, isLoading } = useSWR<StatusPinjaman[]>('/api/statusPinjaman', fetcher);
  return { data, isLoading, isError: error };
};

export const useGetUniqueStatusPinjaman = (id: number) => {
  const { data, error, isLoading } = useSWR<
    Prisma.PromiseReturnType<typeof myPrisma.statusPinjaman.findUnique>
  >('/api/statusPinjaman/' + id, fetcher);

  return { data, isLoading, isError: error };
};