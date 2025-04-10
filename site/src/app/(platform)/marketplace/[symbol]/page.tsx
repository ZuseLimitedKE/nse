"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockChart } from "../_components/StockChart";
import { StockTrades } from "../_components/StockTrades";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

const StockDetail = ({ params }: { params: { symbol: string } }) => {
  const { symbol } = params;
  const [timeframe, setTimeframe] = useState("1D");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("buy"); // "buy" or "sell"
  const [tokenAmount, setTokenAmount] = useState("0");
  console.log(symbol);
  const stock = stockData.safaricom; // In a real app, you would fetch this based on symbol

  const handlePercentageClick = (percentage: number) => {
    setAmount(((stock.price * percentage) / 100).toFixed(2));
  };

  useEffect(() => {
    // Calculate token amount based on KES amount
    if (amount) {
      const tokens = parseFloat(amount) / stock.price;
      setTokenAmount(tokens.toFixed(2));
    } else {
      setTokenAmount("0");
    }
  }, [amount, stock.price]);

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: action === "buy" ? "Purchase Successful" : "Sale Successful",
      description: `You have ${action === "buy" ? "purchased" : "sold"} ${tokenAmount} tokens of ${stock.name} for KES ${amount}`,
    });

    // Reset form
    setAmount("");
  };

  return (
    <div className="container  px-4 md:px-8 lg:px-16 mx-auto py-6">
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
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={timeframe === "1D" ? "default" : "outline"}
                    onClick={() => setTimeframe("1D")}
                  >
                    1D
                  </Button>
                  <Button
                    size="sm"
                    variant={timeframe === "1W" ? "default" : "outline"}
                    onClick={() => setTimeframe("1W")}
                  >
                    1W
                  </Button>
                  <Button
                    size="sm"
                    variant={timeframe === "1M" ? "default" : "outline"}
                    onClick={() => setTimeframe("1M")}
                  >
                    1M
                  </Button>
                  <Button
                    size="sm"
                    variant={timeframe === "3M" ? "default" : "outline"}
                    onClick={() => setTimeframe("3M")}
                  >
                    3M
                  </Button>
                  <Button
                    size="sm"
                    variant={timeframe === "1Y" ? "default" : "outline"}
                    onClick={() => setTimeframe("1Y")}
                  >
                    1Y
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <StockChart timeframe={timeframe} symbol={stock.symbol} />
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
            <Card className="sticky top-20">
              <CardHeader>
                <Tabs
                  defaultValue="buy"
                  onValueChange={(value) => setAction(value)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="sell">Sell</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">KES</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="0"
                        className="pl-12"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePercentageClick(25)}
                      >
                        25%
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePercentageClick(50)}
                      >
                        50%
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePercentageClick(75)}
                      >
                        75%
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePercentageClick(100)}
                      >
                        100%
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      You will {action === "buy" ? "Receive" : "Send"} (
                      {stock.name})
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          {stock.symbol}
                        </span>
                      </div>
                      <Input
                        type="text"
                        className="pl-16"
                        value={tokenAmount}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium">
                        KES {stock.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-sm font-medium">
                        KES {amount || "0"}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    {action === "buy" ? "Buy" : "Sell"} {stock.exchange}
                  </Button>

                  <div className="text-xs text-gray-500">
                    <p>
                      By submitting this order, you agree to our Terms of
                      Service and Privacy Policy. Market conditions may affect
                      final settlement price.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
