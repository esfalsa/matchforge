import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { pageTitle } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: pageTitle() }];
};

export default function Index() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">
        Match<span className="text-green-500">Forge</span>
      </h1>
      <ul className="space-y-2">
        <li>
          <Button className="w-64" asChild>
            <Link to="/match">Simulate Match</Link>
          </Button>
        </li>
        <li>
          <Button className="w-64" variant="secondary" asChild>
            <Link to="/methods">How it Works</Link>
          </Button>
        </li>
      </ul>
    </main>
  );
}
