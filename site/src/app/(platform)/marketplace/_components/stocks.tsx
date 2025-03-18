"use client";
// import { Skeleton } from "@/components/ui/skeleton";
import { getDummyStocks } from "@/server-actions/creations/stocks";
import { useQuery } from "@tanstack/react-query";

export function Stocks() {
  const { data: stocks } = useQuery({
    queryKey: ["stocks"],
    queryFn: getDummyStocks,
  });
  // if (isLoading) {
  //   return (
  //     <div className="w-full grid grid-cols-5 gap-4">
  //       {Array.from({ length: 5 }).map((_, i) => (
  //         <Skeleton key={i} className="w-full h-8" />
  //       ))}
  //     </div>
  //   );
  // }
  return (
    <div className="w-full grid grid-cols-8  justify-between">
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
