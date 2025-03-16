"use client";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
export function Navbar() {
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    // This would be replaced with actual Hedera wallet connection logic
    setWalletConnected(true);
    toast.success("Your Orion wallet has been successfully connected!");
  };

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

        {!walletConnected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={connectWallet}
            className="ml-4"
          >
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="ml-4">
            <Wallet className="mr-2 h-4 w-4" /> Wallet Connected
          </Button>
        )}
      </div>
    </header>
  );
}
