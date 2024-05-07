import { type MatchTeamResult, type Match } from "~/lib/match";

export function MatchStats({ match }: { match: Match }) {
  const stats: {
    name: string;
    key: keyof MatchTeamResult;
    format?: (x: number) => string;
  }[] = [
    { name: "Expected Goals", key: "xG", format: (x: number) => x.toFixed(2) },
    { name: "Shots", key: "shots" },
    { name: "Shots on Goal", key: "shotsOnGoal" },
    {
      name: "Conversion Rate",
      key: "conversionRate",
      format: (x: number) => `${(x * 100).toFixed(2)}%`,
    },
  ];

  return (
    <>
      {stats.map(({ name, key, format }) => {
        return (
          <div key={key}>
            <div className="mt-4 flex w-full flex-row items-center space-x-4">
              <div className="flex-1 text-left">
                {format ? format(match.home[key]) : match.home[key]}
              </div>
              <div className="flex-0 w-28 text-center text-sm text-gray-700 dark:text-gray-400">
                {name}
              </div>
              <div className="flex-1 text-right">
                {format ? format(match.away[key]) : match.away[key]}
              </div>
            </div>
            <div className="mt-1 flex flex-row space-x-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
                <div
                  className="ml-auto h-1 bg-green-500"
                  style={{
                    width: `${(match.home[key] * 100) / (match.home[key] + match.away[key])}%`,
                  }}
                />
              </div>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
                <div
                  className="mr-auto h-1 bg-green-500"
                  style={{
                    width: `${(match.away[key] * 100) / (match.home[key] + match.away[key])}%`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
