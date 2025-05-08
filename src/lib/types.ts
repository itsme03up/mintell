export type GearKey = 'weapon' | 'head' | 'body' | 'hands' | 'legs' | 'feet' | 'ear' | 'neck' | 'wrist' | 'ring';

export interface GearStatus {
  id: number;
  fullName: string;
  gear: Record<GearKey, boolean>;
}
