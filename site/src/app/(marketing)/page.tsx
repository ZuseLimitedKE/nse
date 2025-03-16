import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";
export default function LandingPage() {
  const words = [
    {
      text: "Trade",
    },
    {
      text: "Stocks",
    },
    {
      text: "with",
    },
    {
      text: "Crypto",
      className: "text-primary",
    },
    {
      text: "or",
    },
    {
      text: "Mobile",
      className: "text-primary",
    },
    {
      text: "Money",
      className: "text-primary",
    },
  ];
  return (
    <div className="px-8  grid justify-items-center ">
      {/* Hero Section */}
      <section className=" pt-32 pb-12 md:pt-56 md:pb-20">
        <div className="grid gap-8   items-center">
          <div className="space-y-6 w-full ">
            <h1 className="text-4xl  md:hidden font-bold tracking-tight">
              Trade Stocks with <span className="text-primary">Crypto</span> or{" "}
              <span className="text-primary">Mobile Money</span>
            </h1>
            <TypewriterEffectSmooth
              words={words}
              className="font-bold text-5xl hidden md:flex tracking-tight flex-wrap"
              cursorClassName="bg-primary my-auto"
            />
            <p className="text-lg justify-self-center md:text-xl lg:text-2xl text-muted-foreground md:max-w-5xl text-center ">
              Connect your Orion wallet and start investing in stocks using ETH
              or mobile payments. Track your portfolio and sell when you're
              ready.
            </p>
            <div className="flex gap-4 flex-col md:flex-row justify-self-center">
              <Button
                size="lg"
                asChild
                className="w-64 h-12 text-lg  font-semibold"
              >
                <Link href="/marketplace">
                  <TrendingUp className="mr-2 h-6 w-6" /> Explore Stocks
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-64 h-12 text-lg  font-semibold"
                asChild
              >
                <Link href="/dashboard">
                  <BarChart3 className="mr-2 h-6 w-6" /> Dashboard
                </Link>
              </Button>
            </div>
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
