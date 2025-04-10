"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}

export function GradientBorder({
  children,
  className = "",
  borderClassName = "",
}: GradientBorderProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden group transition-all",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={cn(
          "absolute -inset-px rounded-xl transition-opacity",
          isHovered ? "opacity-100" : "opacity-0",
          borderClassName,
        )}
        style={{
          background: `radial-gradient(400px circle at ${position.x}% ${position.y}%, hsla(var(--primary) / 0.4), transparent 40%)`,
        }}
      />
      <div className="relative h-full bg-background border border-border/40 rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
}
