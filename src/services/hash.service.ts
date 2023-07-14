import bcrypt from 'bcrypt';

/**
 * Hashes a string using a salt of 10.
 * @param input value to hash.
 */
async function hash(input: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(input, salt);

  return hash;
}

/**
 * Validates if a given hash matches a string input.
 * @param input input value (example: password).
 * @param hash hash to compare.
 * @returns Indication if the hash matches.
 */
async function hashMatches(input: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(input, hash);
}

export { hash, hashMatches };
