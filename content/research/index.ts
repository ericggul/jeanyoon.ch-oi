import { sota } from "./sota";
import { passageOfWater } from "./passage-of-water";
import { multiplexJuggling } from "./multiplex-juggling";
import type { ResearchPublication } from "./types";

// Display order. Each record is independently editable/importable.
export const research: readonly ResearchPublication[] = [sota, passageOfWater, multiplexJuggling];
export type { ResearchPublication } from "./types";
