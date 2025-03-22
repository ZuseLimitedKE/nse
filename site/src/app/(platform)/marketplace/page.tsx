import { getQueryClient } from "@/context/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Stocks } from "./_components/stocks";
import { getStocks } from "@/server-actions/stocks/getStocks";
export default async function MarketPlacePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["stocks"],
    queryFn: getStocks,
  });
  // const stocks = await getStocks();
  // console.log(stocks);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stocks /*stocks={stocks}*/ />
    </HydrationBoundary>
  );
}
