import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="px-8  ">
      {/* Hero Section */}
      <section className=" pt-20 pb-12 md:pt-40 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Trade Stocks with <span className="text-primary">Crypto</span> or{" "}
              <span className="text-primary">Mobile Money</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect your Orion wallet and start investing in stocks using ETH
              or mobile payments. Track your portfolio and sell when you're
              ready.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/marketplace">
                  <TrendingUp className="mr-2 h-5 w-5" /> Explore Stocks
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" /> Dashboard
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <img
              src="/placeholder.svg"
              alt="Trading Platform"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" py-12 md:py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-primary/10">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Browse Stocks</CardTitle>
              <CardDescription>
                Explore our selection of available stocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Browse through a curated selection of stocks from various
                markets and sectors.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link href="/marketplace">View Marketplace</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Buy Stocks</CardTitle>
              <CardDescription>
                Purchase stocks using ETH or mobile money
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Choose from a wide range of stocks and pay with your preferred
                payment method.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link href="/marketplace">View Marketplace</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Sell & Cash Out</CardTitle>
              <CardDescription>
                Sell your stocks and receive payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Sell your stocks anytime and receive funds via mobile money or
                ETH to your wallet.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Manage Portfolio</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
