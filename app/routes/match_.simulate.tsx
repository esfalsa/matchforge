import {
  Link,
  useLoaderData,
  useRouteError,
  useSearchParams,
  type ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Match } from "~/lib/match";
import { randomSeed } from "~/lib/seed";

export function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);

  const paramsSchema = z.object({
    home: z.object({
      name: z.string(),
      att: z.preprocess((x) => (x ? Number(x) : x), z.number()),
      def: z.preprocess((x) => (x ? Number(x) : x), z.number()),
    }),
    away: z.object({
      name: z.string(),
      att: z.preprocess((x) => (x ? Number(x) : x), z.number()),
      def: z.preprocess((x) => (x ? Number(x) : x), z.number()),
    }),
    seed: z.string(),
  });

  const parseResult = paramsSchema.parse({
    home: {
      name: searchParams.get("home.name"),
      att: searchParams.get("home.att"),
      def: searchParams.get("home.def"),
    },
    away: {
      name: searchParams.get("away.name"),
      att: searchParams.get("away.att"),
      def: searchParams.get("away.def"),
    },
    seed: searchParams.get("seed"),
  });

  return new Match(parseResult);
}

export default function MatchSimulate() {
  const match = useLoaderData<typeof clientLoader>();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Match Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-row items-center space-x-4">
            <div className="flex-1 text-right">{match.home.name}</div>
            <div className="flex-0 text-center text-lg font-bold">
              {match.home.goals}–{match.away.goals}
            </div>
            <div className="flex-1 text-left">{match.away.name}</div>
          </div>

          <p className="my-4 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Full Time
          </p>

          <div className="mt-4 flex w-full flex-row items-center space-x-4">
            <div className="flex-1 text-right">{match.home.xG.toFixed(2)}</div>
            <div className="flex-0 w-28 text-center text-sm text-gray-700 dark:text-gray-400">
              Expected Goals
            </div>
            <div className="flex-1 text-left">{match.away.xG.toFixed(2)}</div>
          </div>
          <div className="mt-1 flex flex-row space-x-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
              <div
                className="ml-auto h-1 bg-green-500"
                style={{
                  width: `${(match.home.xG * 100) / (match.home.xG + match.away.xG)}%`,
                }}
              />
            </div>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
              <div
                className="mr-auto h-1 bg-green-500"
                style={{
                  width: `${(match.away.xG * 100) / (match.home.xG + match.away.xG)}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
        <hr className="mb-6 mt-2" />
        <CardFooter>
          <div className="flex w-full flex-row space-x-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link
                to={{
                  pathname: "/match",
                  search: searchParams.toString(),
                }}
              >
                Edit Match
              </Link>
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setSearchParams((prev) => {
                  prev.set("seed", randomSeed());
                  return prev;
                });
              }}
            >
              Randomize Seed
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <main className="m-8">
        <h1 className="mb-2 mt-6 text-3xl font-bold">Match Simulation</h1>
        <p>An unexpected error occurred: {error.name}</p>
        <p>{error.message}</p>
        {error.stack && (
          <>
            <h3 className="mb-2 mt-6 text-2xl font-bold">Stacktrace</h3>
            <pre className="rounded bg-gray-200 p-2">{error.stack}</pre>
          </>
        )}
      </main>
    );
  }

  console.error(error);
  return (
    <main className="m-8">
      <h1 className="mb-2 mt-6 text-3xl font-bold">Match Simulation</h1>
      <p>An unexpected error occurred.</p>
    </main>
  );
}
