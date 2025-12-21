import { z } from "zod";

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

import * as updateQueries from "@/db/queries/title/update.ts";

/* =========================
   MAIN TITLE UPDATE
========================= */
export async function updateTitle(input: z.infer<typeof titleUpdateSchema>) {
  const data = titleUpdateSchema.parse(input);
  return updateQueries.updateTitle(data);
}

/* =========================
   GENRE
========================= */
export async function updateTitleGenre(input: unknown) {
  const data = titleGenreUpdateSchema.parse(input);
  return updateQueries.updateTitleGenre(data);
}

/* =========================
   AKA
========================= */
export async function updateTitleAka(input: unknown) {
  const data = titleAkaUpdateSchema.parse(input);
  return updateQueries.updateTitleAka(data);
}

/* =========================
   LINK
========================= */
export async function updateTitleLink(input: unknown) {
  const data = titleLinkUpdateSchema.parse(input);
  return updateQueries.updateTitleLink(data);
}

/* =========================
   NETWORK
========================= */
export async function updateTitleNetwork(input: unknown) {
  const data = titleNetworkUpdateSchema.parse(input);
  return updateQueries.updateTitleNetwork(data);
}

/* =========================
   REGION
========================= */
export async function updateTitleRegion(input: unknown) {
  const data = titleRegionUpdateSchema.parse(input);
  return updateQueries.updateTitleRegion(data);
}

/* =========================
   SPOKEN LANGUAGE
========================= */
export async function updateTitleSpokenLanguage(input: unknown) {
  const data = titleSpokenLanguageUpdateSchema.parse(input);
  return updateQueries.updateTitleSpokenLanguage(data);
}

/* =========================
   LANGUAGE
========================= */
export async function updateTitleLanguage(input: unknown) {
  const data = titleLanguageUpdateSchema.parse(input);
  return updateQueries.updateTitleLanguage(data);
}
