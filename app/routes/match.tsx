import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { randomSeed } from "~/lib/seed";

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
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),

    defaultValues: {
      home: {
        name: searchParams.get("home.name") || "",
        // @ts-expect-error att is a number, but empty string ensures field starts empty
        att: searchParams.has("home.att") ? Number(searchParams.get("home.att")) : "",
        // @ts-expect-error def is a number, but empty string ensures field starts empty
        def: searchParams.has("home.def") ? Number(searchParams.get("home.def")) : "",
      },
      away: {
        name: searchParams.get("away.name") || "",
        // @ts-expect-error att is a number, but empty string ensures field starts empty
        att: searchParams.has("away.att") ? Number(searchParams.get("away.att")) : "",
        // @ts-expect-error def is a number, but empty string ensures field starts empty
        def: searchParams.has("away.def") ? Number(searchParams.get("away.def")) : "",
      },
      seed: searchParams.get("seed") || randomSeed(),
    },
  });
  const home = form.watch("home");
  const away = form.watch("away");

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
    <main className="flex h-full flex-col items-center justify-center px-8">
      <FormProvider {...form}>
        <Form
          action="/match/simulate"
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-96 space-y-6"
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
          <div>
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
            <FormDescription className="mt-2">
              Power Index:{" "}
              {home.def && home.att ?
                (100 / (1 + 1.2 * Math.exp(home.def - home.att))).toFixed(2)
              : "N/A"}
            </FormDescription>
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
          <div>
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
            <FormDescription className="mt-2">
              Power Index:{" "}
              {away.def && away.att ?
                (100 / (1 + 1.2 * Math.exp(away.def - away.att))).toFixed(2)
              : "N/A"}
            </FormDescription>
          </div>
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seed</FormLabel>
                <div className="flex flex-row justify-between space-x-2">
                  <FormControl>
                    <Input
                      placeholder="2dc291d095f9bc5e0a45e93899faf93c13fe5c30"
                      type="text"
                      required
                      {...field}
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      form.setValue("seed", randomSeed());
                    }}
                  >
                    Random
                  </Button>
                </div>
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
