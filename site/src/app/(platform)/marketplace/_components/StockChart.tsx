"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//ADD CHART DATA 
type StockChartProps = {
  timeframe: string;
  symbol: string;
  chartdata: {
    time: Date;
    price: number;
  }[];
};
interface TimeFrame {
  time: string;
  price: number;
}
// Mock data for different timeframes
const generateMockData = (timeframe: string) => {
  // Generate different data shapes based on timeframe

  const basePrice = 150;
  let data: TimeFrame[] = [];

  switch (timeframe) {
    case "1D":
      // Generate hourly data points for one day
      data = Array.from({ length: 8 }, (_, i) => {
        const hour = 9 + i;
        const price = basePrice + (Math.random() - 0.5) * 2;
        return {
          time: `${hour}:00`,
          price: parseFloat(price.toFixed(2)),
        };
      });
      break;
    case "1W":
      // Generate daily data points for one week
      data = Array.from({ length: 7 }, (_, i) => {
        const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
        const price = basePrice + (Math.random() - 0.5) * 5;
        return {
          time: day,
          price: parseFloat(price.toFixed(2)),
        };
      });
      break;
    case "1M":
      // Generate weekly data points for one month
      data = Array.from({ length: 4 }, (_, i) => {
        const week = `Week ${i + 1}`;
        const price = basePrice + (Math.random() - 0.5) * 10;
        return {
          time: week,
          price: parseFloat(price.toFixed(2)),
        };
      });
      break;
    case "3M":
      // Generate monthly data points for three months
      data = Array.from({ length: 3 }, (_, i) => {
        const month = ["Jan", "Feb", "Mar"][i];
        const price = basePrice + (Math.random() - 0.5) * 15;
        return {
          time: month,
          price: parseFloat(price.toFixed(2)),
        };
      });
      break;
    case "1Y":
      // Generate monthly data points for one year
      data = Array.from({ length: 12 }, (_, i) => {
        const month = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i];
        const price = basePrice + (Math.random() - 0.5) * 25;
        return {
          time: month,
          price: parseFloat(price.toFixed(2)),
        };
      });
      break;
    default:
      data = [];
  }

  return data;
};

export function StockChart({ timeframe, symbol, chartdata }: StockChartProps) {
  const data = generateMockData(timeframe);
  console.log(symbol);console.log(symbol);
  // // Find min and max for proper chart display
  // const prices = data.map((item) => item.price);
  // const minPrice = Math.min(...prices) - 0.5;
  // const maxPrice = Math.max(...prices) + 0.5;

  //FORMATTING THE DATA HERE
  const formattedData = chartdata.map((point) => ({
    time: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // customize based on timeframe
    price: point.price,
  }));

  const prices = formattedData.map((item) => item.price);
  const minPrice = Math.min(...prices) - 0.5;
  const maxPrice = Math.max(...prices) + 0.5;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" axisLine={false} tickLine={false} />
          <YAxis
            domain={[minPrice, maxPrice]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <Tooltip
            formatter={(value: number) => [`KES ${value}`, "Price"]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
