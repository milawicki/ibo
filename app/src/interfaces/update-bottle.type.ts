import { Bottle } from ".";

export type UpdateBottle = Omit<Bottle, 'name' | 'symbol' | 'owner' | 'totalSupply' | 'bottles'>;
