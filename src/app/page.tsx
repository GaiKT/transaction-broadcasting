"use client";

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { DataTable } from "@/components/transaction-status/table";
import { Payment } from "@/components/transaction-status/table";

const formSchema = z.object({
  symbol: z.string().min(1, { message: "Please select a symbol." }),
  price: z.string().min(1, { message: "Price is required." }),
  timestamp: z.number(),
});

export default function Home() {
  const { toast } = useToast();

  const [transaction, setTransaction] = useState<Payment[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      price: "",
      timestamp: Math.floor(Date.now() / 1000),
    },
  });

  const pushTransaction = (data: Payment) => {
    setTransaction((prevTransactions) => [
      ...prevTransactions,
      data,
    ]);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post('/api/proxy', {
        ...values,
        price: Number(values.price),
      });
      pushTransaction({
        ...values,
        price: Number(values.price),
        id: `${response.data.tx_hash}`,
        status: "PENDING",
      });
      toast({
        title: "Transaction created successfully!",
        description: "Your transaction has been broadcast.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "We were unable to broadcast your transaction.",
      });
    }
  }

  return (
    <main className="flex h-screen w-screen justify-center items-center bg-gray-200 p-2">
      <div className="flex max-lg:flex-col gap-5 md:w-3/4 w-full max-lgitems-center">
        <div className="w-1/2 max-lg:w-3/4 max-md:w-full">
          <h1 className="text-center py-2 bg-black text-white rounded-t-md">
            Transaction Broadcasting
          </h1>
          <div className="bg-slate-50 shadow-md rounded-b-md p-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-5">
                      <FormLabel>Symbol</FormLabel>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your Symbol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin</SelectItem>
                          <SelectItem value="ETH">Ethereum</SelectItem>
                          <SelectItem value="USDT">Tether</SelectItem>
                          <SelectItem value="BNB">BNB</SelectItem>
                          <SelectItem value="SOL">Solana</SelectItem>
                          <SelectItem value="DOGE">Dogecoin</SelectItem>
                          <SelectItem value="BAND">Band Protocol</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-5">
                      <FormLabel>Price</FormLabel>
                      <div className="flex gap-5 items-center">
                        <FormControl>
                          <Input
                            placeholder="Symbol price, e.g., 100000"
                            {...field}
                          />
                        </FormControl>
                        <span className="text-gray-500">THB</span>
                      </div>
                      <FormMessage />
                      <FormDescription>
                        Please check the information is correct.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className="flex w-full justify-end mt-5">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="bg-slate-50 shadow-md rounded-b-md w-1/2 max-lg:w-3/4 max-md:w-full">
          <h1 className="text-center py-2 bg-black text-white rounded-t-md">
            Transaction Status
          </h1>
          <div className="p-5">
            <DataTable data={transaction} setStatus={setTransaction}/>
          </div>
        </div>
      </div>
    </main>
  );
}
