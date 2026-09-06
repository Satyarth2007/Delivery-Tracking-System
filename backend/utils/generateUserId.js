import User from "../models/User.js";

/**
 * Generates a random 10-digit numeric userId as a string,
 * e.g. "4827193056". Leading digit is never 0 so it's always
 * exactly 10 characters long.
 *
 * Checks the Users collection for a collision (extremely rare
 * at 10 digits) and retries if one is found.
 */
async function generateUserId() {
  let userId;
  let exists = true;

  while (exists) {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
    let rest = "";
    for (let i = 0; i < 9; i++) {
      rest += Math.floor(Math.random() * 10);
    }
    userId = `${firstDigit}${rest}`;

    exists = await User.exists({ userId });
  }

  return userId;
}

export default generateUserId;