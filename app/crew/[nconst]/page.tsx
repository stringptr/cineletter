import Image from "next/image";

import { tmdb } from "@/services/tmdb.ts";

export default async function Page(
  { params }: { params: { nconst: string } },
) {
  const tmdb_id = await tmdb.idFromImdb(params.nconst, "person");
  const details = await tmdb.person.details(tmdb_id);
  const credits = await tmdb.person.credits(tmdb_id, "combined");

  return (
    <div className="grid grid-cols-2">
      <div></div>
      <div className="flex flex-col w-[200px] gap-8 overflow-hidden">
        <Image
          width={200}
          height={200}
          src={`https://image.tmdb.org/t/p/original${details?.profile_path}`}
          className="rounded-md"
        />
        <h1 className="text-2xl text-white">{details.name}</h1>
      </div>
    </div>
  );
}
