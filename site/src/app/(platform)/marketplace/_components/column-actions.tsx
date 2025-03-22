"use client";
import { StockData } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { stkPushSchema } from "@/constants/types";
import { Spinner } from "@/components/ui/spinner";
import { IconCash } from "@tabler/icons-react";
import { IconShoppingCart } from "@tabler/icons-react";
import { sendSTKPush } from "@/server-actions/mpesa/send-stk-push";
// Defines the form value type from the schema
type FormValues = z.infer<typeof stkPushSchema>;

export function ColumnActions({ entry }: { entry: StockData }) {
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    amount: entry.price * 0,
    customer_phone_number: "",
    stock_symbol: entry.symbol,
  };
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(stkPushSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      //TODO: Call Server Action/endpoint
      await sendSTKPush(data);
      // Show success message
      toast.info(`Sent, waiting for payment confirmation...`);

      // Reset the form
      form.reset();
    } catch (error) {
      toast.error("Error:unable to initiate STK push");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconShoppingCart className="h-4 w-4 mr-1" /> Buy
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase {entry.symbol}</DialogTitle>
          <DialogDescription>
            {entry.name} - Current Price: KSH{" "}
            {entry.price.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customer_phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+254 11581 6456" {...field} />
                  </FormControl>
                  <FormDescription>Enter your phone number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-semibold md:w-auto">
              {isSubmitting ? (
                <Spinner className="mr-1 h-4 w-4 text-white" />
              ) : (
                <IconCash className="mr-1 h-4 w-4" strokeWidth={2} />
              )}
              {isSubmitting ? "Pay" : "Processing"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
