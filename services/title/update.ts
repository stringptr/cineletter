import { z } from "zod";
import withDbContext from "@/db/context.ts";
import { titleCompleteUpdateSchema } from "@/schemas/title/update.ts";
import * as updateQueries from "@/db/queries/title/update.ts";

export async function updateTitleComplete(
  payload: z.infer<typeof titleCompleteUpdateSchema>,
) {
  return await withDbContext(async (trx) => {
    if (payload.details) {
      await updateQueries.titleUpdate(trx, payload.details);
    }
    if (payload.akas) {
      for (const aka of payload.akas) {
        await updateQueries.titleAkaUpdate(trx, aka);
      }
    }
    if (payload.genres) {
      for (const genre of payload.genres) {
        await updateQueries.titleGenreUpdate(trx, genre);
      }
    }
    if (payload.links) {
      for (const link of payload.links) {
        await updateQueries.titleLinkUpdate(trx, link);
      }
    }
    if (payload.networks) {
      for (const network of payload.networks) {
        await updateQueries.titleNetworkUpdate(trx, network);
      }
    }
    if (payload.regions) {
      for (const region of payload.regions) {
        await updateQueries.titleRegionUpdate(trx, region);
      }
    }
    if (payload.spokenLanguages) {
      for (const spLang of payload.spokenLanguages) {
        await updateQueries.titleSpokenLanguageUpdate(trx, spLang);
      }
    }
    if (payload.languages) {
      for (const lang of payload.languages) {
        await updateQueries.titleLanguageUpdate(trx, lang);
      }
    }

    return { success: true };
  });
}
