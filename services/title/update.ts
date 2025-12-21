import { z } from "zod"
import {
  titleAkaUpdateSchema,
  titleGenreUpdateSchema,
  titleLanguageUpdateSchema,
  titleLinkUpdateSchema,
  titleNetworkUpdateSchema,
  titleRegionUpdateSchema,
  titleSpokenLanguageUpdateSchema,
  titleUpdateSchema,
} from "@/schemas/title/update.ts";

import {
  updateTitle,
  updateTitleAka,
  updateTitleGenre,
  updateTitleLanguage,
  updateTitleLink,
  updateTitleNetwork,
  updateTitleRegion,
  updateTitleSpokenLanguage,
} from "@/db/queries/title/update.ts";

/* =========================
   MAIN TITLE UPDATE
========================= */
export async function updateTitleService(input: z.infer<typeof >) {
  const data = titleUpdateSchema.parse(input);
  return updateTitle(data);
}

/* =========================
   GENRE
========================= */
export async function updateTitleGenreService(input: unknown) {
  const data = titleGenreUpdateSchema.parse(input);
  return updateTitleGenre(data);
}

/* =========================
   AKA
========================= */
export async function updateTitleAkaService(input: unknown) {
  const data = titleAkaUpdateSchema.parse(input);
  return updateTitleAka(data);
}

/* =========================
   LINK
========================= */
export async function updateTitleLinkService(input: unknown) {
  const data = titleLinkUpdateSchema.parse(input);
  return updateTitleLink(data);
}

/* =========================
   NETWORK
========================= */
export async function updateTitleNetworkService(input: unknown) {
  const data = titleNetworkUpdateSchema.parse(input);
  return updateTitleNetwork(data);
}

/* =========================
   REGION
========================= */
export async function updateTitleRegionService(input: unknown) {
  const data = titleRegionUpdateSchema.parse(input);
  return updateTitleRegion(data);
}

/* =========================
   SPOKEN LANGUAGE
========================= */
export async function updateTitleSpokenLanguageService(input: unknown) {
  const data = titleSpokenLanguageUpdateSchema.parse(input);
  return updateTitleSpokenLanguage(data);
}

/* =========================
   LANGUAGE
========================= */
export async function updateTitleLanguageService(input: unknown) {
  const data = titleLanguageUpdateSchema.parse(input);
  return updateTitleLanguage(data);
}
