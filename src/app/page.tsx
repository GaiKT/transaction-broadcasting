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

const formSchema = z.object({
  symbol: z.string().min(1, { message: "Please select a symbol." }),
  price: z.string().min(1, { message: "Price is required." }),
  timestamp: z.number(),
});

export default function Home() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      price: "",
      timestamp: Math.floor(Date.now() / 1000),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      let result = await axios.post(
        "https://mock-node-wgqbnxruha-as.a.run.app/broadcast",
        {...values , price : Number(values.price)}
      );
      console.log(result);
      toast({
        title: "Transaction create successfully!",
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
    <main className="flex h-screen w-screen justify-center items-center">
      <div className="w-1/3">
        <h1 className="text-center py-2 bg-black text-white rounded-t-md">
          Transaction Broadcasting
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-5 border rounded-md space-y-8"
          >
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
                  <FormDescription>
                    Please check the information is correct.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
