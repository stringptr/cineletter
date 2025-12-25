import { z } from "zod";
import withDbContext from "@/db/context.ts";
import { titleCompleteUpdateSchema } from "@/schemas/title/update.ts";
import { titleCompleteSchema } from "../../schemas/title/base.ts";
import * as updateQueries from "@/db/queries/title/update.ts";
import * as deleteQueries from "@/db/queries/title/delete.ts";
import * as addQueries from "@/db/queries/title/add.ts";

export async function updateTitleComplete(
  payload:
    | z.infer<
      typeof titleCompleteUpdateSchema
    >
    | z.infer<
      typeof titleCompleteSchema
    >,
) {
  return await withDbContext(async (trx) => {
    if (payload.title) {
      await updateQueries.titleUpdate(trx, payload.title);
    }
    if (payload.title_akas) {
      for (const aka of payload.title_akas) {
        if (Object.keys(aka).length > 0) {
          if (aka.will_be_deleted) {
            await deleteQueries.titleAkaDelete(trx, aka);
          } else if (aka.will_be_added) {
            await addQueries.titleAkaAdd(trx, aka);
          } else {
            await updateQueries.titleAkaUpdate(trx, aka);
          }
        }
      }
    }
    if (payload.title_genres) {
      for (const genre of payload.title_genres) {
        if (Object.keys(genre).length > 0) {
          if (genre.will_be_deleted) {
            await deleteQueries.titleGenreDelete(trx, genre);
          } else if (genre.will_be_added) {
            await addQueries.titleGenreAdd(trx, genre);
          } else {
            await updateQueries.titleGenreUpdate(trx, genre);
          }
        }
      }
    }
    if (payload.title_links) {
      for (const link of payload.title_links) {
        if (Object.keys(link).length > 0) {
          if (link.will_be_deleted) {
            await deleteQueries.titleLinkDelete(trx, link);
          } else if (link.will_be_added) {
            await addQueries.titleLinkAdd(trx, link);
          } else {
            await updateQueries.titleLinkUpdate(trx, link);
          }
        }
      }
    }
    if (payload.title_networks) {
      for (const network of payload.title_networks) {
        if (Object.keys(network).length > 0) {
          if (network.will_be_deleted) {
            await deleteQueries.titleAkaDelete(trx, network);
          } else if (network.will_be_added) {
            await addQueries.titleNetworkAdd(trx, network);
          } else {
            await updateQueries.titleNetworkUpdate(trx, network);
          }
        }
      }
    }
    if (payload.title_regions) {
      for (const region of payload.title_regions) {
        if (Object.keys(region).length > 0) {
          if (region.will_be_deleted) {
            await deleteQueries.titleRegionDelete(trx, region);
          } else if (region.will_be_added) {
            await addQueries.titleRegionAdd(trx, region);
          } else {
            await updateQueries.titleRegionUpdate(trx, region);
          }
        }
      }
    }
    if (payload.title_spoken_languages) {
      for (const spLang of payload.title_spoken_languages) {
        if (Object.keys(spLang).length > 0) {
          if (spLang.will_be_deleted) {
            await deleteQueries.titleSpokenLanguageDelete(trx, spLang);
          } else if (spLang.will_be_added) {
            await addQueries.titleSpokenLanguageAdd(trx, spLang);
          } else {
            await updateQueries.titleSpokenLanguageUpdate(trx, spLang);
          }
        }
      }
    }
    if (payload.title_languages) {
      for (const lang of payload.title_languages) {
        if (Object.keys(lang).length > 0) {
          if (lang.will_be_deleted) {
            await deleteQueries.titleLanguageDelete(trx, lang);
          } else if (lang.will_be_added) {
            await addQueries.titleLanguageAdd(trx, lang);
          } else {
            await updateQueries.titleLanguageUpdate(trx, lang);
          }
        }
      }
    }

    return { success: true };
  });
}
