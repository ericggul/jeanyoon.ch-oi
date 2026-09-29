import type { ArtworkDiscovery } from "./types";
import banpo_xism from "./banpo-xism";
import omega from "./omega";
import sota from "./sota";
import not_equal from "./not-equal";

export const artworkDiscovery: Record<string, ArtworkDiscovery> = {
  "banpo-xism": banpo_xism,
  "omega": omega,
  "sota": sota,
  "not-equal": not_equal,
};
