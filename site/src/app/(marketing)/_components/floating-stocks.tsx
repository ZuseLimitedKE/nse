"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface StockTicker {
  symbol: string;
  price: string;
  change: number;
}

interface FloatingStocksProps {
  tickers: StockTicker[];
  className?: string;
}

export function FloatingStocks({ tickers, className }: FloatingStocksProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(".stock-ticker");
    if (!elements.length) return;

    const animateElements = () => {
      elements.forEach((element, i) => {
        // Create random 3D floating animation for each ticker
        const speed = 0.2 + Math.random() * 0.5;
        const xPos = Math.sin(Date.now() * speed * 0.001 + i) * 20;
        const yPos = Math.cos(Date.now() * speed * 0.001 + i) * 15;
        const zPos = Math.cos(Date.now() * speed * 0.0005 + i) * 10;

        // Apply transform with slight rotation
        (element as HTMLElement).style.transform = `
          translate3d(${xPos}px, ${yPos}px, ${zPos}px)
          rotate(${xPos * 0.1}deg)
        `;

        // Apply opacity based on z position (simulating depth)
        const opacity = 0.5 + Math.min(1, (100 + zPos) / 120);
        (element as HTMLElement).style.opacity = opacity.toString();
      });

      requestAnimationFrame(animateElements);
    };

    const animationId = requestAnimationFrame(animateElements);

    return () => cancelAnimationFrame(animationId);
  }, [tickers]);

  return (
    <div ref={containerRef} className={cn("h-full w-full relative", className)}>
      {tickers.map((ticker, index) => (
        <div
          key={ticker.symbol + index}
          className={cn(
            "stock-ticker absolute bg-background/70 backdrop-blur-md border p-3 rounded-lg shadow-lg transition-transform will-change-transform",
            ticker.change > 0 ? "border-green-500/20" : "border-red-500/20",
          )}
          style={{
            top: `${20 + ((index * 30) % 60)}%`,
            left: `${10 + ((index * 40) % 70)}%`,
            zIndex: 10 - (index % 5),
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono font-bold">{ticker.symbol}</span>
            <span className="font-mono">{ticker.price}</span>
            <span
              className={cn(
                "font-mono text-sm",
                ticker.change > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {ticker.change > 0 ? "+" : ""}
              {ticker.change.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
