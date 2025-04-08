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
// import { stkPushSchema } from "@/constants/types";
import { Spinner } from "@/components/ui/spinner";
import { IconCash } from "@tabler/icons-react";
import { IconShoppingCart } from "@tabler/icons-react";
// import { sendSTKPush } from "@/server-actions/mpesa/send-stk-push";
import { Label } from "@/components/ui/label";
import { store_stock_purchase } from "@/server-actions/buy/stock_holdings";
// import { useAppKitAccount } from "@reown/appkit/react";
import {
  HederaSignerType,
  HWBridgeSigner,
  useAccountId,
  useWallet,
} from "@buidlerlabs/hashgraph-react-wallets";
// import markRequestAsPaid from "@/server-actions/mpesa/markPaid";
import { getIfUserHasOwnedStock } from "@/server-actions/stocks/get_user_own_stock";
import { TokenAssociateTransaction } from "@hashgraph/sdk";
// import updateUserStockHoldings from "@/server-actions/stocks/update_stock_holdings";
// paystack hook
import { usePaystack } from "@/hooks/use-paystack";
import { makePaymentRequest } from "@/server-actions/paystack/makePaymentRequest";
import { Errors } from "@/constants/errors";
// Defines the form value type from the schema
const paymentSchema = z.object({
  email: z.string().email("enter a valid email address"),
  amount: z
    .number({ message: Errors.INVALID_AMOUNT })
    .gt(0, { message: Errors.INVALID_AMOUNT })
    .transform((val) => Math.ceil(val)), //round up to next shilling
  stock_symbol: z
    .string({ message: Errors.INVALID_SYMBOL })
    .max(9, { message: Errors.INVALID_SYMBOL }),
});

type FormValues = z.infer<typeof paymentSchema>;
function isHederaSigner(signer: HWBridgeSigner): signer is HederaSignerType {
  // Check based on properties that are unique to HederaSignerType
  return (signer as HederaSignerType).topic !== undefined;
}
export function ColumnActions({ entry }: { entry: StockData }) {
  const [quantity, setQuantity] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const { isConnected, address } = useAppKitAccount();
  const { isConnected } = useWallet();
  const { data: accountId } = useAccountId();
  const { signer } = useWallet();
  const { isReady: paystackReady, initiatePayment } = usePaystack();
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: entry.price,
      email: "",
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
    const finalAmount = Math.ceil(entry.price * quantity); // Calculate amount dynamically
    data.amount = finalAmount; // Override the amount field

    if (!accountId || !isConnected) {
      toast.warning("you need to connect your wallet in order to proceed");
      return;
    }
    if (!paystackReady) {
      toast.warning(
        "Payment system is still loading. Please try again in a moment.",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      // const mpesa_request_id = await sendSTKPush({
      //   ...data,
      //   amount: finalAmount,
      // });
      const transaction = await makePaymentRequest(
        data.email,
        finalAmount * 100,
      );
      setTimeout(() => {
        setDialogOpen(false);
      }, 1000);
      initiatePayment({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: data.email,
        amount: finalAmount * 100,
        ref: transaction.reference,
        access_code: transaction.access_code,
        currency: "KES",
        callback: async (response) => {
          toast.success(`Payment complete! Reference:${response.reference}`);
          try {
            //store the stock purchase using the reference
            await store_stock_purchase({
              stock_symbol: data.stock_symbol,
              name: entry.name,
              amount_shares: quantity,
              buy_price: finalAmount,
              paystack_id: transaction.reference,
              user_wallet: accountId,
              purchase_date: new Date(),
              transaction_type: "buy",
            });
            const userOwnStock = await getIfUserHasOwnedStock(
              accountId,
              entry.tokenID,
            );
            //associate the token if needed
            if (!userOwnStock) {
              if (!signer) {
                toast.error("Wallet not connected");
                return;
              }
              if (!isHederaSigner(signer)) {
                toast.error("Invalid signer");
                return;
              }

              console.log("Does not own token");
              const txTokenAssociate = new TokenAssociateTransaction()
                .setAccountId(accountId)
                .setTokenIds([entry.tokenID]); //Fill in the token ID

              //Sign with the private key of the account that is being associated to a token
              const signTxTokenAssociate =
                await txTokenAssociate.freezeWithSigner(signer);
              console.log("Signing");
              await signTxTokenAssociate.executeWithSigner(signer);
              console.log("Finished signing");
            }
            // Show success message
            toast.success(
              `Payment successful! You've purchased ${quantity} shares of ${entry.symbol}`,
            );

            // Reset form
            form.reset();
            setQuantity(0);
          } catch (error) {
            console.error("Error processing successful payment:", error);
            toast.error(
              "Error completing your purchase. Please contact support.",
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        onClose: function() {
          toast.info("Payment cancelled or window closed");
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Error: unable to initiate payment");
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                value={quantity}
                onChange={(e) => {
                  setQuantity(parseInt(e.target.value));
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. johndoe@example.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter your email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <label className="text-sm font-medium">Total Amount</label>
              <div className="text-xl font-bold overflow-hidden">
                KSH{" "}
                {quantity
                  ? (entry.price * quantity).toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })
                  : 0}
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
