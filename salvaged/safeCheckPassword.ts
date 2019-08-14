export function safeCheckPassword(a: string, b: string): boolean {
  let mismatch = 0;
  for (let i = 0; i < a.length; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  // returns true if password is correct
  return mismatch === 0;
}
