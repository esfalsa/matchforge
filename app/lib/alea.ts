/**
 * An implementation of Johannes Baagøe's Alea seeded PRNG algorithm.
 *
 * Adapted from an algorithm by Johannes Baagøe, originally released under the MIT License:
 *
 * ```txt
 * Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ```
 */
export class Alea {
  private s0: number;
  private s1: number;
  private s2: number;
  private c: number;

  constructor(...seeds: string[]) {
    const { mash } = new Mash();

    let s0 = mash(" ");
    let s1 = mash(" ");
    let s2 = mash(" ");
    const c = 1;

    for (const seed of seeds) {
      s0 -= mash(seed);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(seed);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(seed);
      if (s2 < 0) {
        s2 += 1;
      }
    }

    this.s0 = s0;
    this.s1 = s1;
    this.s2 = s2;
    this.c = c;
  }

  clone() {
    const alea = new Alea();
    alea.s0 = this.s0;
    alea.s1 = this.s1;
    alea.s2 = this.s2;
    alea.c = this.c;
    return alea;
  }

  random() {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
    this.s0 = this.s1;
    this.s1 = this.s2;
    return (this.s2 = t - (this.c = t | 0));
  }

  uint32() {
    return this.random() * 0x100000000; // 2^32
  }

  fract53() {
    return this.random() + ((this.random() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
  }

  /**
   * Returns a random number following a given Poisson distribution using [Knuth's algorithm](https://en.wikipedia.org/wiki/Poisson_distribution#Random_variate_generation).
   *
   * @param lambda the expected number of events per interval
   */
  poisson(lambda: number) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;

    do {
      k = k + 1;
      p = p * this.random();
    } while (p > L);

    return k - 1;
  }

  /**
   * Returns a random number following a given normal distribution using the [Box–Muller transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform).
   *
   * @param mu the mean of the distribution
   * @param sigma the standard deviation of the distribution
   */
  normal(mu: number = 0, sigma: number = 1) {
    let u1 = 0;
    let u2 = 0;

    do {
      u1 = this.random();
    } while (u1 === 0);

    do {
      u2 = this.random();
    } while (u2 === 0);

    return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) + mu;
  }
}

class Mash {
  private n: number;

  constructor() {
    this.n = 0xefc8249d;
    this.mash = this.mash.bind(this);
  }

  mash(data: string) {
    for (let i = 0; i < data.length; i++) {
      this.n += data.charCodeAt(i);
      let h = 0.02519603282416938 * this.n;
      this.n = h >>> 0;
      h -= this.n;
      h *= this.n;
      this.n = h >>> 0;
      h -= this.n;
      this.n += h * 0x100000000; // 2^32
    }
    return (this.n >>> 0) * 2.3283064365386963e-10; // 2^-32
  }
}
