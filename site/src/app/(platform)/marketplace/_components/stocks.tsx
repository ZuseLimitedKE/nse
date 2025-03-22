"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getStocks } from "@/server-actions/stocks/getStocks";
// import { usePolling } from "@/hooks/usePolling";
interface Stocks {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
}
export function Stocks(/*{ stocks }: { stocks: Stocks[] }*/) {
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocks,
    // enable polling
    refetchInterval: 8000,
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
  // usePolling(15000);
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
