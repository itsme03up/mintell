import { GearKey } from "./types";

export const requirements: Record<number, GearKey[]> = {
  1: ["ear", "neck", "wrist", "ring"],        // 1層：アクセ４点
  2: ["weapon", "head", "body", "hands"],     // 2層：IL760防具４点
  3: ["legs", "feet", "weapon", "head", "body", "hands"], // 3層：防具＋武器
  4: ["weapon", "head", "body", "hands", "legs", "feet", "ear", "neck", "wrist", "ring"] // 4層：フル装備
};
