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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      {/* Hero Section */}{" "}
      <section className="pt-32 px-8  w-full relative pb-12 md:pt-56 lg:h-screen md:pb-20">
        <div className="grid gap-8   items-center">
          <div className="space-y-6 w-full ">
            <h1 className="text-4xl  md:hidden my-auto max-w-xl font-bold tracking-tight">
              Trade Stocks with <span className="text-primary">Crypto</span> or{" "}
              <span className="text-primary">Mobile Money</span>
            </h1>
            <TypewriterEffectSmooth
              words={words}
              className="font-bold  flex justify-center  text-5xl hidden md:flex tracking-tight flex-wrap"
              cursorClassName="bg-primary my-auto"
            />
            <p className="text-lg mx-auto  md:text-xl lg:text-2xl text-muted-foreground md:max-w-5xl  text-left md:text-center ">
              Connect your Orion wallet and start investing in stocks using ETH
              or mobile money. Track your portfolio and sell when you&apos;re
              ready.
            </p>
            <div className="md:flex gap-4  justify-center items-center grid">
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
      <section className=" z-20 py-12 md:py-20 px-8">
        <h2 className="text-3xl lg:text-4xl  font-bold text-center mb-12">
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
      {/*FAQ Section*/}
      <section className=" py-12 md:py-20 px-8  w-full relative ">
        <h2 className="text-3xl lg:text-4xl   font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="w-full bg-white rounded-sm p-2 border border-primary/10 rounded-xl px-4 ">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I start investing?</AccordionTrigger>
              <AccordionContent>
                Connect your Orion wallet, browse our marketplace for stocks,
                and purchase using ETH or mobile money. It&apos;s that simple!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What payment methods are accepted?
              </AccordionTrigger>
              <AccordionContent>
                We currently accept ETH and various mobile money providers. More
                payment options will be added soon.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                How do I cash out my investments?
              </AccordionTrigger>
              <AccordionContent>
                Go to your dashboard, select the stocks you want to sell, and
                choose your preferred withdrawal method. Funds will be
                transferred within 24 hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Are there any fees?</AccordionTrigger>
              <AccordionContent>
                There are no hidden fees or monthly charges.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
