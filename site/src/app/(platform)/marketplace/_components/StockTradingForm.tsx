"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

type StockProps = {
  name: string;
  symbol: string;
  exchange: string;
  price: number;
};

export default function StockTradingForm({ stock }: { stock: StockProps }) {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("buy"); // "buy" or "sell"
  const [tokenAmount, setTokenAmount] = useState("0");

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
    <Card className="sticky top-20">
      <CardHeader>
        <Tabs defaultValue="buy" onValueChange={(value) => setAction(value)}>
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
            <label className="block text-sm font-medium mb-2">Amount</label>
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
              You will {action === "buy" ? "Receive" : "Send"} ({stock.name})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{stock.symbol}</span>
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
              <span className="text-sm font-medium">KES {stock.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-sm font-medium">KES {amount || "0"}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            {action === "buy" ? "Buy" : "Sell"} {stock.exchange}
          </Button>

          <div className="text-xs text-gray-500">
            <p>
              By submitting this order, you agree to our Terms of Service and
              Privacy Policy. Market conditions may affect final settlement
              price.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
