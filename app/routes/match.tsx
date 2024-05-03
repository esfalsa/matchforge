import { Form, useSubmit } from "@remix-run/react";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  home: z.object({
    name: z.string(),
    att: z.coerce.number(),
    def: z.coerce.number(),
  }),
  away: z.object({
    name: z.string(),
    att: z.coerce.number(),
    def: z.coerce.number(),
  }),
  seed: z.string(),
});

export default function Match() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),

    defaultValues: {
      home: {
        name: "",
        // @ts-expect-error att is a number, but empty string ensures field starts empty
        att: "",
        // @ts-expect-error def is a number, but empty string ensures field starts empty
        def: "",
      },
      away: {
        name: "",
        // @ts-expect-error att is a number, but empty string ensures field starts empty
        att: "",
        // @ts-expect-error def is a number, but empty string ensures field starts empty
        def: "",
      },
    },
  });

  const submit = useSubmit();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(data.home)) {
      params.append(`home.${key}`, String(value));
    }
    for (const [key, value] of Object.entries(data.away)) {
      params.append(`away.${key}`, String(value));
    }
    params.append("seed", data.seed);

    submit(params.toString(), {
      action: "/match/simulate",
      method: "GET",
    });
  }

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <FormProvider {...form}>
        <Form
          action="/match/simulate"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-96 space-y-6"
        >
          <FormField
            control={form.control}
            name="home.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Barcelona" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="home.att"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Team Attack Rating</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2.4"
                      type="number"
                      inputMode="decimal"
                      step={0.1}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="home.def"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Team Defense Rating</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.4"
                      type="number"
                      inputMode="decimal"
                      step={0.1}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="away.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Away Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Real Madrid" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="away.att"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Away Team Attack Rating</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2.6"
                      type="number"
                      inputMode="decimal"
                      step={0.1}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="away.def"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Away Team Defense Rating</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.6"
                      type="number"
                      inputMode="decimal"
                      step={0.1}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seed</FormLabel>
                <FormControl>
                  <Input placeholder="123" type="text" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </Form>
      </FormProvider>
    </main>
  );
}
