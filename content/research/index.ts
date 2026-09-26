import { banpoXism } from "./banpo-xism";
import { sota } from "./sota";
import { passageOfWater } from "./passage-of-water";
import { multiplexJuggling } from "./multiplex-juggling";
import type { ResearchEntry } from "./types";

// Display order. Each record is independently editable/importable.
export const research: readonly ResearchEntry[] = [banpoXism, sota, passageOfWater, multiplexJuggling];
export type { ResearchEntry, ResearchPublication, ResearchManuscript } from "./types";
