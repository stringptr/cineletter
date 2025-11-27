import Image from "next/image";
import Link from "next/link";

import { tmdb } from "@/services/tmdb.ts";
import { imdb } from "@/services/imdb.ts";

export default async function Page(
  { params }: { params: { searched: string } },
) {
  const data = await tmdb.title.search(params.searched);
  if (!data || !data.results) {
    return <div className="text-white">No results found.</div>;
  }
  const results = data.results;
  const title_ids = await Promise.all(
    results.map((item: any) => tmdb.title.title_idFromId(item.id)),
  );
  const imdb_data = await Promise.all(
    title_ids.map((item: any) => imdb.getDetails(item)),
  );
  const combined = results.map((item: any, idx: number) => ({
    ...item,
    title_id: title_ids[idx],
    imdb_data: imdb_data[idx],
  }));

  return (
    <div className="text-white flex flex-col items-center gap-12">
      {combined.map((item: any) => (
        <Link
          key={item.id}
          href={`/title/${item.title_id}`}
          className={`${
            item.title_id === null ? "hidden" : "flex"
          } group flex-row gap-8 w-[50vw] mx-auto overflow-hidden`}
        >
          <Image
            width={200}
            height={200}
            src={item?.imdb_data?.primaryImage?.url ?? null}
            alt={item.original_title}
            className="overflow-hidden min-w-[200px] rounded-sm"
          />
          <div className="flex flex-col gap-2 py-2">
            <h4 className="text-2xl text-white group-hover:underline">
              {item.original_title}
            </h4>
            <p className="overflow-hidden no-underline line-clamp-6">
              {item?.imdb_data?.plot}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
