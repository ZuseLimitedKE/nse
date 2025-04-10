//I MADE THIS PAGE A SERVER COMPONENT
//CHECK StockChartControls and
//StockTradingForm for the code I extracted
//-ANTHONY
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { StockChart } from "../_components/StockChart";
import { StockTrades } from "../_components/StockTrades";
import StockTradingForm from "../_components/StockTradingForm";
import StockChartControls from "../_components/StockChartControls";
import getPriceChartData from "@/server-actions/stocks/get_price_chart_data";

// Mock stock data
const stockData = {
  safaricom: {
    name: "Safaricom",
    symbol: "SCOM",
    exchange: "nhSCOM",
    price: 150.0,
    change: 0.35,
    changePercent: 2.07,
    description:
      "Safaricom PLC is a leading telecommunications company in Kenya. It provides mobile services, data, and voice solutions to consumers and businesses.",
    supply: 250000.0,
    borrow: 93000.0,
    apy: 4.2,
    utilizationRate: 37.2,
  },
};

export default async function StockDetail({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  console.log(symbol);
  const stock = stockData.safaricom;
  const data = await getPriceChartData(symbol); //Fetching the stock data
  return (
    <div className="container px-4 md:px-8 lg:px-16 mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{stock.name}</h1>
              <span className="text-gray-500">({stock.symbol})</span>
              <span className="text-xs text-gray-400">{stock.exchange}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-semibold mr-2">
                KES {stock.price.toFixed(2)}
              </span>
              <div
                className={`flex items-center ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {stock.change >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About {stock.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{stock.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-4">
              <div className="text-xs text-muted-foreground flex items-center">
                <span>TOTAL SUPPLY</span>
                <Info className="h-3 w-3 ml-1" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">
                {stock.supply.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {stock.exchange}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <div className="text-xs text-muted-foreground flex items-center">
                <span>TOTAL BORROW</span>
                <Info className="h-3 w-3 ml-1" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">
                {stock.borrow.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {stock.exchange}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <div className="text-xs text-muted-foreground flex items-center">
                <span>SUPPLY APY</span>
                <Info className="h-3 w-3 ml-1" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold text-primary">
                {stock.apy}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <div className="text-xs text-muted-foreground flex items-center">
                <span>UTILIZATION RATE</span>
                <Info className="h-3 w-3 ml-1" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">{stock.utilizationRate}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
                <StockChartControls />
              </CardHeader>
              <CardContent>
                <StockChart timeframe="1D" chartdata={data} />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <StockTrades symbol={stock.symbol} />
              </CardContent>
            </Card>
          </div>

          <div>
            <StockTradingForm
              stock={{
                name: stock.name,
                symbol: stock.symbol,
                exchange: stock.exchange,
                price: stock.price,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
