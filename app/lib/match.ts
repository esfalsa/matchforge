import { Alea } from "~/lib/alea";

export type MatchInput = {
  home: {
    name: string;
    att: number;
    def: number;
  };
  away: {
    name: string;
    att: number;
    def: number;
  };
  seed: string;
  [_other: string | number | symbol]: unknown;
};

export type MatchResult = {
  home: MatchTeamResult;
  away: MatchTeamResult;
};

export type MatchTeamResult = {
  goals: number;
  xG: number;
  shots: number;
  shotsOnGoal: number;
  conversionRate: number;
  goalMinutes: string[]; // not number because e.g. 45+3' is distinct from 48'
};

export class Match {
  readonly home: MatchTeamResult & MatchInput["home"];
  readonly away: MatchTeamResult & MatchInput["away"];
  readonly seed;
  readonly datetime;

  constructor(data: MatchInput) {
    this.seed = data.seed;
    this.datetime = data.datetime;

    const alea = new Alea(data.seed);

    this.home = {
      ...data.home,
      ...Match.simulateTeam((data.home.att + data.away.def) / 2, alea),
    };
    this.away = {
      ...data.away,
      ...Match.simulateTeam((data.away.att + data.home.def) / 2, alea),
    };
  }

  static simulateTeam(baseXG: number, alea: Alea) {
    const xG = alea.normal(baseXG, 0.2);
    const goals = alea.poisson(baseXG);
    const shots = Math.max(goals, alea.poisson(baseXG * 9.6));
    const shotsOnGoal = Math.max(goals, alea.poisson(baseXG * 3.4));
    const firstHalfAddedTime = alea.normal(3, 1);
    const secondHalfAddedTime = alea.normal(5, 1.5);

    const goalMinutes = alea
      .uniqueIntegers(goals, 1, 90 + firstHalfAddedTime + secondHalfAddedTime)
      .sort()
      .map((minute) => {
        if (minute <= 45) {
          return `${minute}’`;
        } else if (minute <= 45 + firstHalfAddedTime) {
          return `45+${minute - 45}’`;
        } else if (minute <= 90 + firstHalfAddedTime) {
          return `${minute}’`;
        } else {
          return `90+${minute - 90}’`;
        }
      });

    return {
      xG,
      goals,
      shots,
      shotsOnGoal,
      get conversionRate() {
        return this.shots === 0 ? 0 : this.goals / this.shots;
      },
      goalMinutes,
    };
  }
}
