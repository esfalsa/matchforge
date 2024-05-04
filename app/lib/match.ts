import { Alea } from "~/lib/alea";

type MatchInput = {
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

    const homeXG = alea.normal((data.home.att + data.away.def) / 2, 0.2);
    this.home = {
      ...data.home,
      xG: homeXG,
      goals: alea.poisson(homeXG),
    };

    const awayXG = alea.normal((data.away.att + data.home.def) / 2, 0.2);
    this.away = {
      ...data.away,
      xG: awayXG,
      goals: alea.poisson(awayXG),
    };
  }
}
