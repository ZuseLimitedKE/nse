import { getQueryClient } from "@/context/get-query-client";
import { getDummyStocks } from "@/server-actions/creations/stocks";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Stocks } from "./_components/stocks";

export default async function MarketPlacePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["stocks"],
    queryFn: getDummyStocks,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stocks />
    </HydrationBoundary>
  );
}
