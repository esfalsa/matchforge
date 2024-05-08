import { Link, type MetaFunction } from "@remix-run/react";
import { TeX as $ } from "~/components/TeX";
import { pageTitle } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: pageTitle("Methodology") }];
};

export default function Methods() {
  return (
    <main className="flex h-full justify-center p-8 sm:p-16">
      <div>
        <nav className="mb-8">
          <Link to="/" className="text-green-500">
            ← Home
          </Link>
        </nav>
        <article className="prose prose-gray prose-green pb-16 dark:prose-invert sm:pb-36">
          <section>
            <h1>Methodology</h1>
            <h2>Team Ratings</h2>
            <h3>Attack and Defense Ratings</h3>
            <p>
              MatchForge calcualtes results for each match using an offensive and defensive rating
              for each term, drawing inspiration from the{" "}
              <a
                href="https://fivethirtyeight.com/methodology/how-our-club-soccer-predictions-work/"
                target="_blank"
                rel="noopener noreferrer"
              >
                club football predictions
              </a>{" "}
              formerly maintained by FiveThirtyEight. The offensive rating is, loosely speaking, the
              number of goals a team is expected to score per match (so higher is better), while the
              defensive rating is the number of goals a team is expected to concede per match (so
              lower is better). In matches, the average number of goals scored by each team is
              determined by the average of its offensive rating and its opponent’s defensive rating.
            </p>
            <h3>Power Index</h3>
            <p>
              MatchForge calculates a power index for each team based on its offensive and defensive
              ratings, drawing inspiration from FiveThirtyEight’s Soccer Power Index (SPI). While
              the formula that was used to calculate SPI is not public, the general idea is that the
              SPI represents the percentage of possible points per game that a team is expected to
              win. From their{" "}
              <a
                href="https://github.com/fivethirtyeight/data/tree/master/soccer-spi"
                target="_blank"
                rel="noopener noreferrer"
              >
                publicly available data
              </a>
              , I was able to find an equation that seems to fit reasonably well. If <$>\alpha</$>{" "}
              is a team’s attack rating and <$>\beta</$> is a team’s defense rating, then{" "}
              <$>\alpha - \beta</$> is the average goal difference expected per game. Then, the
              power index <$>I</$> is given by
              <$ options={{ displayMode: true }}>{`I = \\frac{100}{1+1.2e^{\\beta - \\alpha}}`}</$>
              which you may recognize as a logistic function that takes the expected goal difference
              as input. It’s not a perfect fit, but I like it because it has a fairly nice intuitive
              explanation: the <$>100</$> term ensures the rating is between <$>0</$> and <$>100</$>
              , as would be expected of a percentage value, and the <$>1.2</$> term ensures that the
              power index is less than <$>50</$> for a team with an expected goal difference of{" "}
              <$>0</$>, because a draw earns only a third of the points of a win.
            </p>
            <p>
              It’s worth noting that the power index doesn’t actually affect the outcomes of
              matches; rather, it’s just a tool to help users estimate the relative strength of
              different teams.
            </p>
          </section>
          <section>
            <h2>Match Simulation</h2>
            <h3>Seeds</h3>
            <p>
              The results of each match are calculated based on a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Pseudorandom_number_generator"
                target="_blank"
                rel="noopener noreferrer"
              >
                pseudorandom number generator
              </a>
              , which generates numbers that appear random but which are determined by a seed value.
              Given the same team ratings and the same seed, the results of the match will be the
              same every time. These values are also saved in the URL, so that the results of a
              match can be saved without needing to store every result in a centralized database.
            </p>
            <p>
              MatchForge uses the Alea algorithm developed by Johannes Baagøe; though his site is no
              longer available on the internet, its content has been{" "}
              <a
                href="https://github.com/nquinlan/better-random-numbers-for-javascript-mirror"
                target="_blank"
                rel="noopener noreferrer"
              >
                archived
              </a>{" "}
              elsewhere.
            </p>
            <h3>Expected Goals</h3>
            <p>
              The first step in simulating a match is to determine the expected goals per side. On
              average, given random seeds, the number of goals scored by a team will be the average
              of its offensive rating and the defensive rating of its opponent; hence, a higher
              offensive rating produces more goals scored on average, and a higher defensive rating
              produces more goals conceded on average.
            </p>
            <p>
              Then, a ‘jitter’ is applied to each value, a random value that is <$>0</$> on average
              but follows a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Normal_distribution"
                target="_blank"
                rel="noopener noreferrer"
              >
                normal distribution
              </a>{" "}
              (calculated determinstically using the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform"
                target="_blank"
                rel="noopener noreferrer"
              >
                Box–Muller transform
              </a>
              ). The expected goals shown on the results screen is actually the value with the
              jitter applied; otherwise, those statistics would be the same for every match between
              those two teams, regardless of the seed. The actual number of expected goals, however,
              is used for the simulation.
            </p>
            <h3>Goals</h3>
            <p>
              The goals scored by each team are drawn from a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Poisson_distribution"
                target="_blank"
                rel="noopener noreferrer"
              >
                Poisson distribution
              </a>
              , calculated using a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Poisson_distribution#Random_variate_generation"
                target="_blank"
                rel="noopener noreferrer"
              >
                method developed by Donald Knuth
              </a>
              . The Poisson distribution expresses the probability of a given number of events
              occurring within a given interval of time, given that on average <$>\lambda</$> events
              occur per interval. More precisely, the goals scored by each team are drawn from two
              independent Poisson distributions, where the average number of events is equal to the
              expected goals for that team.
            </p>
            <p>
              There has been some research into whether the Poisson distribution is the best
              distribution for modeling football scores, but it is relatively simple to calculate
              (as opposed to predictive models in the real world, which are fitted to existing data
              rather than generating that data from the model). FiveThirtyEight used{" "}
              <a
                href="https://fivethirtyeight.com/methodology/how-our-club-soccer-predictions-work/"
                target="_blank"
                rel="noopener noreferrer"
              >
                two Poisson distributions
              </a>
              , albeit with increased probabilities of a draw. Others have used Poisson
              distributions with other modifications; for instance, Dixon and Coles{" "}
              <a
                href="https://www.jstor.org/stable/2986290"
                target="_blank"
                rel="noopener noreferrer"
              >
                raised probabilities of low-scoring matches
              </a>{" "}
              that end 0–0, 1–0, 0–1, or 1–1.
            </p>
            <p>The times at which goals are scored are drawn from a uniform random distribution.</p>
            <h3>Shots</h3>
            <p>
              I didn’t find the same level of research into the number of shots taken per game; it
              seems like most research is focused on predicting outcomes of matches, and hence on
              predicting goals scored. Instead, MatchForge works backwards from the number of goals
              scored based on typical shot conversion rates.
            </p>
            <p>
              I did find some public datasets of football match events, including shots, shots on
              goal, and goals; I primarily used a{" "}
              <a
                href="https://www.nature.com/articles/s41597-019-0247-7
"
                target="_blank"
                rel="noopener noreferrer"
              >
                public data set
              </a>{" "}
              released by Pappalardo et al. If you’re interested, I wrote a couple of quick{" "}
              <a
                href="https://gist.github.com/esfalsa/012df4249b9550c3ca3c9de837bd58bb"
                target="_blank"
                rel="noopener noreferrer"
              >
                shell scripts
              </a>{" "}
              to find the conversion rate data, which MatchForge roughly approximates. In short,
              around 10% of shots are scored, and around 30% of shots on goal are scored.
            </p>
            <p>
              The expected numbers of shots and shots on goal are calculated by scaling up the
              team’s expected goals and a typical real-world conversion rate, and then drawn from a
              Poisson distribution, so that the number of shots is not the same every time the same
              two teams face each other.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
