import * as attributes from "@/db/queries/title/attributes.ts";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const flatten = searchParams.get("flatten") === "true";

  const [genres, languages, spoken_languages, types, networks, regions] =
    await Promise.all([
      attributes.genres(),
      attributes.languages(),
      attributes.spoken_languages(),
      attributes.types(),
      attributes.networks(),
      attributes.regions(),
    ]);

  const result = {
    genres,
    languages,
    spoken_languages,
    types,
    networks,
    regions,
  };

  if (!flatten) {
    return NextResponse.json(result);
  }

  const grouped = Object.fromEntries(
    Object.entries(result).map(([key, items]) => [
      key,
      items.map((item: Record<string, any>) => {
        const values = Object.values(item);

        return {
          value: values[0],
          label: values[1] ?? values[0],
        };
      }),
    ]),
  );

  return NextResponse.json(grouped);
}
