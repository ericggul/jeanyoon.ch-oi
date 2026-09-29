import { banpoXism } from "./banpo-xism";
import { omega } from "./omega";
import { sota } from "./sota";
import { notEqual } from "./not-equal";
import type { Artwork } from "./types";

export const menuDescription = "Multi-device web artworks";
export const artworks: Artwork[] = [banpoXism, omega, sota, notEqual];
export type { Artwork, ArtworkText, Locale } from "./types";
