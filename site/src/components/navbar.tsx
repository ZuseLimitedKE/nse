"use client";
import { Sparkles } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
export function Navbar() {
  return (
    <header className="border-b bg-background fixed flex items-center justify-between top-0 left-0 right-0 z-50 px-4">
      <div className=" flex h-16 items-center justify-between  w-full ">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center text-white font-bold">
              <Sparkles />
            </div>
            <div className="md:text-2xl text-xl font-semibold">ORION</div>
          </div>
        </div>
        <WalletButton />
      </div>
    </header>
  );
}
