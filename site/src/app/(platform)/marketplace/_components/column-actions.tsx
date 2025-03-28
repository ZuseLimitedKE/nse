"use client";
import { StockData } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import { store_stock_purchase } from "@/server-actions/buy/stock_holdings";
import { useAppKitAccount } from "@reown/appkit/react";
import updateUserStockHoldings from "@/server-actions/stocks/update_stock_holdings";
// Defines the form value type from the schema
type FormValues = z.infer<typeof stkPushSchema>;

export function ColumnActions({ entry }: { entry: StockData }) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected, address } = useAppKitAccount();
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(stkPushSchema),
    defaultValues: {
      amount: entry.price,
      customer_phone_number: "",
      stock_symbol: entry.symbol,
    },
    // mode: "onSubmit",
  });

  // Update the form value when quantity changes
  // useEffect(() => {
  //   form.setValue("amount", Math.ceil(entry.price * quantity), {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });
  //   console.log("effect ran");
  // }, [quantity, entry.price, form.setValue]);
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    const finalAmount = entry.price * quantity; // Calculate amount dynamically
    data.amount = finalAmount; // Override the amount field

    if (!address || !isConnected) {
      toast.warning("you need to connect your wallet in order to proceed");
      return;
    }

    setIsSubmitting(true);

    try {
      const mpesa_request_id = await sendSTKPush({
        ...data,
        amount: finalAmount,
      });
      await store_stock_purchase({
        stock_symbol: data.stock_symbol,
        name: entry.name,
        amount_shares: quantity,
        buy_price: finalAmount,
        mpesa_request_id: mpesa_request_id,
        user_wallet: address,
        purchase_date: new Date(),
        transaction_type: "buy"
      });
      await updateUserStockHoldings({
        stock_symbol: data.stock_symbol,
        stock_name: entry.name,
        number_stock: quantity,
        user_address: address,
        operation: "buy",
      });
      // Show success message
      toast.info(`Sent, waiting for payment confirmation...`);

      // Reset form
      form.reset();
      setQuantity(1);
    } catch (error) {
      console.error("STK push error:", error);
      toast.error("Error: unable to initiate STK push");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Log validation errors when submit fails
  const onError = (errors: FieldErrors<FormValues>) => {
    Object.keys(errors).forEach((field) => {
      const key = field as keyof FormValues;
      toast.error(`Error: ${errors[key]?.message}`);
    });
  };

  // Log form state changes for debugging
  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     console.log("Form values changed:", value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => { }}>
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
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 1;
                  setQuantity(newValue);
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="customer_phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="254*********"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter your phone number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <label className="text-sm font-medium">Total Amount</label>
              <div className="text-xl font-bold overflow-hidden">
                KSH{" "}
                {(entry.price * quantity).toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold md:w-auto"
              >
                {isSubmitting ? (
                  <Spinner className="mr-1 h-4 w-4 text-white" />
                ) : (
                  <IconCash className="mr-1 h-4 w-4" strokeWidth={2} />
                )}
                {isSubmitting ? "Processing" : "Pay"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
