"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { ChartContainer } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  BarChart3,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
//import { toast } from "react-toastify";

// Mock data for portfolio
const mockPortfolio = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 5,
    buyPrice: 17300.2,
    currentPrice: 18500.45,
    change: 6.94,
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corp.",
    shares: 2,
    buyPrice: 31500.1,
    currentPrice: 32750.78,
    change: 3.97,
  },
  {
    id: 3,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 3,
    buyPrice: 15800.9,
    currentPrice: 15320.9,
    change: -3.04,
  },
  {
    id: 4,
    symbol: "AMZN",
    name: "Amazon.com",
    shares: 1,
    buyPrice: 28500.3,
    currentPrice: 28950.65,
    change: 1.58,
  },
];

// Mock data for portfolio performance
const performanceData = [
  { name: "Jan", value: 150000 },
  { name: "Feb", value: 157000 },
  { name: "Mar", value: 162000 },
  { name: "Apr", value: 158000 },
  { name: "May", value: 165000 },
  { name: "Jun", value: 172000 },
  { name: "Jul", value: 178000 },
];
interface Stock {
  id: number;
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  change: number;
}
const DashBoardPage = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Calculate portfolio totals
  const totalInvested = mockPortfolio.reduce(
    (acc, stock) => acc + stock.buyPrice * stock.shares,
    0,
  );
  const currentValue = mockPortfolio.reduce(
    (acc, stock) => acc + stock.currentPrice * stock.shares,
    0,
  );
  const totalProfit = currentValue - totalInvested;
  const profitPercentage = (totalProfit / totalInvested) * 100;

  const handleSell = () => {
    // This would be replaced with actual sell logic
    if (!selectedStock) {
      toast.warning("No stock has been selected");
      return;
    }
    toast.success(
      `Sale successful,you sold ${sellQuantity} shares of ${selectedStock.symbol}. Payment sent via ${paymentMethod === "mobile" ? "mobile money" : "ETH"}`,
    );
  };

  return (
    <div className=" px-4 md:px-8 lg:px-16 mx-auto mb-4">
      <h1 className=" text-2xl font-bold mt-6 mb-2">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Value
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSH{" "}
              {currentValue.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p
              className={`text-xs ${profitPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {profitPercentage >= 0 ? (
                <ArrowUp className="inline h-3 w-3" />
              ) : (
                <ArrowDown className="inline h-3 w-3" />
              )}
              {Math.abs(profitPercentage).toFixed(2)}% from total investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Profit/Loss
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totalProfit >= 0 ? "+" : ""}KSH{" "}
              {totalProfit.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              From initial investment of KSH{" "}
              {totalInvested.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stocks Owned</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPortfolio.length}</div>
            <p className="text-xs text-muted-foreground">
              Total of{" "}
              {mockPortfolio.reduce((acc, stock) => acc + stock.shares, 0)}{" "}
              shares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>
            Your portfolio value over time (KSH)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `KSH ${value.toLocaleString()}`,
                    "Value",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Stock Holdings</CardTitle>
          <CardDescription>
            Manage your portfolio and sell stocks when you&apos;re ready
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Buy Price (KSH)</TableHead>
                <TableHead className="text-right">
                  Current Price (KSH)
                </TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPortfolio.map((stock) => {
                // const stockValue = stock.currentPrice * stock.shares;
                const stockProfit =
                  (stock.currentPrice - stock.buyPrice) * stock.shares;
                const profitPercent =
                  ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) *
                  100;

                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">
                      {stock.symbol}
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell className="text-right">{stock.shares}</TableCell>
                    <TableCell className="text-right">
                      {stock.buyPrice.toLocaleString("en-KE", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {stock.currentPrice.toLocaleString("en-KE", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      className={`text-right ${stockProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stockProfit >= 0 ? (
                        <ArrowUp className="inline h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4 mr-1" />
                      )}
                      {Math.abs(profitPercent).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStock(stock);
                              setSellQuantity(1);
                            }}
                          >
                            Sell
                          </Button>
                        </DialogTrigger>
                        {selectedStock && selectedStock.id === stock.id && (
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Sell {selectedStock.symbol}
                              </DialogTitle>
                              <DialogDescription>
                                {selectedStock.name} - Current Price: KSH{" "}
                                {selectedStock.currentPrice.toLocaleString(
                                  "en-KE",
                                  { minimumFractionDigits: 2 },
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label
                                  htmlFor="sell-quantity"
                                  className="text-sm font-medium"
                                >
                                  Quantity to Sell (Max: {selectedStock.shares})
                                </label>
                                <Input
                                  id="sell-quantity"
                                  type="number"
                                  min="1"
                                  max={selectedStock.shares}
                                  value={sellQuantity}
                                  onChange={(e) =>
                                    setSellQuantity(
                                      parseInt(e.target.value) || 1,
                                    )
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                  Total Amount to Receive
                                </label>
                                <div className="text-xl font-bold">
                                  KSH{" "}
                                  {(
                                    selectedStock.currentPrice * sellQuantity
                                  ).toLocaleString("en-KE", {
                                    minimumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                  Payment Method
                                </label>
                                <div className="flex space-x-2">
                                  <Button
                                    variant={
                                      paymentMethod === "mobile"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => setPaymentMethod("mobile")}
                                    className="flex-1"
                                  >
                                    Mobile Money
                                  </Button>
                                  <Button
                                    variant={
                                      paymentMethod === "eth"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => setPaymentMethod("eth")}
                                    className="flex-1"
                                  >
                                    ETH
                                  </Button>
                                </div>
                              </div>
                              {paymentMethod === "mobile" && (
                                <div className="grid gap-2">
                                  <label
                                    htmlFor="phone"
                                    className="text-sm font-medium"
                                  >
                                    Phone Number
                                  </label>
                                  <Input
                                    id="phone"
                                    placeholder="+254..."
                                    value={phoneNumber}
                                    onChange={(e) =>
                                      setPhoneNumber(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSell}>Confirm Sale</Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashBoardPage;
