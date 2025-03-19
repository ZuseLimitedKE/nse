"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getDummyStocks } from "@/server-actions/creations/stocks";
import { useQuery } from "@tanstack/react-query";

export function Stocks() {
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: getDummyStocks,
    // enable polling
    refetchInterval: 3000,
  });
  if (isLoading) {
    return (
      <div className="w-full grid gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="w-24 h-8 bg-gray-200" />
        ))}
      </div>
    );
  }
  return (
    <div className="w-full grid  justify-between">
      {stocks?.map((stock, index) => (
        <div className="" key={index}>
          {stock.id}
          {stock.change}
          {stock.price}
          {stock.name}
          {stock.symbol}
        </div>
      ))}
    </div>
  );
}
