export function randomSeed() {
  const arr = new Uint8Array(20);
  crypto.getRandomValues(arr);
  return arr.reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
}
