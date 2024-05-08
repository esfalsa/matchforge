import { expect, test } from "vitest";
import { Alea } from "./alea";

test("same seed produces same sequence", () => {
  const alea1 = new Alea("seed1");
  const alea2 = new Alea("seed1");

  for (let i = 0; i < 1000; i++) {
    expect(alea1.random()).toEqual(alea2.random());
  }
});

test("empty seed produces same sequence", () => {
  const alea1 = new Alea();
  const alea2 = new Alea();

  for (let i = 0; i < 1000; i++) {
    expect(alea1.random()).toEqual(alea2.random());
  }
});

test("state can be transferred", () => {
  const alea1 = new Alea("seed");
  const alea2 = alea1.clone();

  expect(alea2.random()).toEqual(alea1.random());
});

test("same seed produces same poisson values", () => {
  const alea1 = new Alea("seed1");
  const alea2 = new Alea("seed1");

  for (let i = 0; i < 1000; i++) {
    expect(alea1.poisson(4)).toEqual(alea2.poisson(4));
  }
});

test("poisson distribution", () => {
  for (const seed of ["seed1", "seed2", "seed3", "seed4", "seed5"]) {
    const alea = new Alea(seed);

    const values = Array.from({ length: 1000 }, () => alea.poisson(4));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    // Poisson distribution has mean equal to lambda = 4
    expect(mean).toBeGreaterThan(3.8);
    expect(mean).toBeLessThan(4.2);

    // Poisson distribution has around 43.35% of values less than lambda = 4
    const lessThanLambda = values.reduce((count, val) => (val < 4 ? count + 1 : count), 0);
    expect(lessThanLambda).toBeGreaterThan(401);
    expect(lessThanLambda).toBeLessThan(466);
  }
});

test("normal distribution", () => {
  for (const seed of ["seed1", "seed2", "seed3", "seed4", "seed5"]) {
    const alea = new Alea(seed);

    const values = Array.from({ length: 1000 }, () => alea.normal(4, 1));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    // normal distribution has mean equal to mu = 4
    expect(mean).toBeGreaterThan(3.8);
    expect(mean).toBeLessThan(4.2);

    // normal distribution has 50% of values less than mu = 4
    const lessThanLambda = values.reduce((count, val) => (val < 4 ? count + 1 : count), 0);
    expect(lessThanLambda).toBeGreaterThan(450);
    expect(lessThanLambda).toBeLessThan(550);
  }
});

test("uniqueIntegers produces unique values", () => {
  const alea = new Alea("seed");
  const values = new Set();

  for (const value of alea.uniqueIntegers(100)) {
    expect(values.has(value)).toBe(false);
    values.add(value);
  }
});
