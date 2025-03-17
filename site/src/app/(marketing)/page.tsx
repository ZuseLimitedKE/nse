import { BackgroundBeams } from "@/components/ui/background-beams";
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
import {
  IconCash,
  IconChartBar,
  IconFileDollar,
  IconTimeline,
} from "@tabler/icons-react";
import { TrendingUp } from "lucide-react";
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
    {
      text: ".",
      className: "text-primary",
    },
  ];
  return (
    <div className="relative  grid justify-items-center ">
      <BackgroundBeams />

      {/* Hero Section */}
      <section className="pt-32 px-8 relative pb-12 md:pt-64 lg:h-screen md:pb-20">
        <div className="grid gap-8   items-center">
          <div className="space-y-6 w-full ">
            <h1 className="text-4xl  md:hidden my-auto max-w-xl font-bold tracking-tight">
              Trade Stocks with <span className="text-primary">Crypto</span> or{" "}
              <span className="text-primary">Mobile Money</span>
            </h1>
            <TypewriterEffectSmooth
              words={words}
              className="font-bold text-5xl hidden md:flex tracking-tight flex-wrap"
              cursorClassName="bg-primary my-auto"
            />
            <p className="text-lg justify-self-center md:text-xl lg:text-2xl text-muted-foreground md:max-w-5xl  text-left md:text-center ">
              Connect your Orion wallet and start investing in stocks using ETH
              or mobile payments. Track your portfolio and sell when you&apos;re
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
                  <IconChartBar className="mr-2 h-6 w-6 text-black" /> Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" z-50 py-12 md:py-20 px-8">
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-primary/10">
            <CardHeader>
              <IconTimeline className="h-10 w-10 text-primary mb-4" />
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
              <Link
                href="/marketplace"
                className="hover:underline text-sm hover:text-primary text-muted-foreground"
              >
                View Marketplace
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow">
            <CardHeader>
              <IconFileDollar className="h-10 w-10 text-primary mb-4" />
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
              <Link
                className="hover:underline text-sm hover:text-primary text-muted-foreground"
                href="/marketplace"
              >
                View Marketplace
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow">
            <CardHeader>
              <IconCash className="h-10 w-10 text-primary mb-4" />
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
              <Link
                className="hover:underline text-sm hover:text-primary text-muted-foreground"
                href="/dashboard"
              >
                Manage Portfolio
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
