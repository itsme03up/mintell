import { requirements } from "./raidRequirements";
import { GearKey } from "./types";

export function calcEligibleLayer(gear: Record<GearKey, boolean>): number {
  // もっとも高い層からチェック
  const layers = Object.keys(requirements)
    .map(Number)
    .sort((a, b) => b - a);
    
  for (const layer of layers) {
    const reqs = requirements[layer];
    // 全て所持しているか
    if (reqs.every((k) => gear[k])) {
      return layer;
    }
  }
  return 0; // どの層にも満たない
}
