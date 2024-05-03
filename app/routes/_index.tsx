import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">
        Match<span className="text-green-500">Forge</span>
      </h1>
      <ul>
        <li>
          <Button className="w-64" asChild>
            <Link to="/match">Simulate Match</Link>
          </Button>
        </li>
      </ul>
    </main>
  );
}
