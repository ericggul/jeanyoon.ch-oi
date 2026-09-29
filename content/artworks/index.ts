import { banpoXism } from "./banpo-xism";
import { omega } from "./omega";
import { sota } from "./sota";
import { notEqual } from "./not-equal";
import type { Artwork } from "./types";

export const menuDescription = "Multi-Device Web Artworks";
export const introduction = "Interactive Multi-Device Web Artworks where audiences interact with surrounding screens and projections from their own mobile phones.";
export const artworks: Artwork[] = [banpoXism, omega, sota, notEqual];
export type { Artwork, ArtworkText, Locale } from "./types";
