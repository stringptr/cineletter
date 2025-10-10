import Image from "next/image";
import { imdb } from "@/services/imdb.ts";
import { getImagePalette } from "@/lib/palette-gen.ts";

export async function Titles({ tconst }: { tconst: string }) {
  const data = await imdb.getDetails(tconst);
  const palette = await getImagePalette(data.primaryImage.url);

  if (data !== null) {
    return (
      <div className="flex flex-row m-0 p-0 relative">
        <a href={data.primaryImage.url} target="_blank">
          <Image
            src={data.primaryImage.url}
            alt={data.primaryTitle}
            width={data.primaryImage.width}
            height={data.primaryImage.height}
            className="rounded-md m-0 w-[300px] h-auto object-contain cursor-zoom-in"
          />
        </a>
        <h1
          className={`m-0 font-extrabold text-[8rem]`}
          style={{ color: palette.DarkVibrant?.hex }}
        >
          {data.primaryTitle.toUpperCase()}
        </h1>
      </div>
    );
  } else {
    return (
      <>
        Title can't be found.
      </>
    );
  }
}

export async function Details({ tconst }: { tconst: string }) {
  const data = await imdb.getDetails(tconst);

  if (data !== null) {
    return (
      <div className="m-0 p-0 relative">
        <p className="text-md">{data.plot}</p>
      </div>
    );
  } else {
    return (
      <>
        Details can't be found.
      </>
    );
  }
}
