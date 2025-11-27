import Image from "next/image";
import Link from "next/link";
import { imdb } from "@/services/imdb.ts";
import { getImagePalette } from "@/lib/palette-gen.ts";

export async function PrimaryPoster({ title_id }: { title_id: string }) {
  const data = await imdb.getDetails(title_id);

  if (data !== null) {
    return (
      <div className="flex flex-row m-0 p-0 relative">
        <Link href={data.primaryImage.url} target="_blank">
          <Image
            src={data.primaryImage.url}
            alt={data.primaryTitle}
            width={data.primaryImage.width}
            height={data.primaryImage.height}
            className="rounded-md m-0 w-[300px] h-auto object-contain cursor-zoom-in"
          />
        </Link>
      </div>
    );
  } else {
    return (
      <>
        Primary Poster can't be found.
      </>
    );
  }
}

export async function Titles({ title_id }: { title_id: string }) {
  const data = await imdb.getDetails(title_id);
  const palette = await getImagePalette(data.primaryImage.url);

  if (data !== null) {
    return (
      <>
        <h1
          className={`relative p-0 mt-4 mb-6 font-bold text-[5rem] leading-[1.1]`}
          style={{ color: palette.Vibrant?.hex }}
        >
          {data.primaryTitle}
        </h1>
        <h3 className={`ml-[5px] relative p-0 m-0 font-normal text-xl`}>
          {data.startYear}
        </h3>
        <div className="flex flex-row">
          <h3 className={`ml-[5px] relative p-0 m-0 font-normal text-xl`}>
            Directed by
          </h3>
          <Link
            href={`/crew/${data.directors[0].id}`}
            className={`b-1 border-b ml-[5px] relative p-0 m-0 font-normal text-xl`}
          >
            {data.directors[0].displayName}
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        Title can't be found.
      </>
    );
  }
}

export async function Details({ title_id }: { title_id: string }) {
  const data = await imdb.getDetails(title_id);

  if (data !== null) {
    return (
      <div className="m-0 p-0 relative">
        <p className="text-lg">{data.plot}</p>
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
