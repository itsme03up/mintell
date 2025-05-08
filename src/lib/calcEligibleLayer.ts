import { requirements } from "./raidRequirements";
import { GearKey, GearStatus } from "./types";

// Define a map of which tier drops which gear parts
const gearDropTiers = {
  // Tier 1 drops
  ear: 1,
  neck: 1,
  wrist: 1,
  ring: 1,
  
  // Tier 2 drops
  head: 2,
  hands: 2,
  feet: 2,
  
  // Tier 3 drops
  body: 3,
  legs: 3,
  
  // Weapon typically comes from the final tier or token exchange
  weapon: 4
};

// Calculate which tier the player is eligible for based on their current gear
export function calcEligibleLayer(gear: GearStatus['gear']): number {
  // If any piece is missing, the player is not eligible for any tier
  for (const piece in gear) {
    if (!gear[piece as keyof typeof gear]) {
      return 0;
    }
  }
  // If all pieces are present, the player is eligible for all tiers
  return 4;
}

// Calculate which tier(s) the player needs to target based on their missing gear
export function calcNeededTiers(gear: GearStatus['gear']): number[] {
  const neededTiers: Set<number> = new Set();
  
  // Check each gear piece
  for (const piece in gear) {
    // If the piece is missing, add its tier to the needed tiers
    if (!gear[piece as keyof typeof gear]) {
      const tier = gearDropTiers[piece as keyof typeof gearDropTiers];
      if (tier) neededTiers.add(tier);
    }
  }
  
  // Convert Set to sorted array
  return Array.from(neededTiers).sort();
}
