import Image from "next/image";
import { tmdb } from "@/services/tmdb.ts";

export default async function Page(
  { params }: { params: { searched: string } },
) {
  const data = await tmdb.titleSearch(params.searched);

  if (!data || !data.results) {
    return <div className="text-white">No results found.</div>;
  }

  const results = data.results;

  const tconsts = await Promise.all(
    results.map((item: any) => tmdb.tconstFromId(item.id)),
  );

  const combined = results.map((item: any, idx: number) => ({
    ...item,
    tconst: tconsts[idx],
  }));

  return (
    <div className="space-y-4">
      {combined.map((item: any) => (
        <a key={item.id} href={`/title/${item.tconst}`}>
          <h4 className="text-2xl text-white hover:underline">
            {item.original_title}
          </h4>
        </a>
      ))}
    </div>
  );
}
