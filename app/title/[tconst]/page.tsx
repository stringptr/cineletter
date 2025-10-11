import { Metadata } from "next";
import Image from "next/image";

import { BannerImages, ImagesCarousel } from "./images.tsx";
import { Details, PrimaryPoster, Titles } from "./titles.tsx";
import { tmdb } from "@/services/tmdb.ts";
import { imdb } from "@/services/imdb.ts";

export default async function Page({ params }: { params: { tconst: string } }) {
  const id = await tmdb.idFromImdb(params.tconst);
  const dataImages = await tmdb.getImages(id);

  return (
    <div className="px-auto w-full text-white">
      <BannerImages data={dataImages} />
      <div className="grid grid-cols-2 gap-20 w-[80vw] pt-[32rem]">
        <div className="ml-auto max-w-content pt-4">
          <PrimaryPoster tconst={params.tconst} />
        </div>
        <div className="flex flex-col w-[600px]">
          <Titles tconst={params.tconst} />
          <div className="mt-8 ml-[5px] flex flex-col gap-8">
            <Details tconst={params.tconst} />
            <ImagesCarousel tconst={params.tconst} type="poster" />
            <ImagesCarousel tconst={params.tconst} type="still_frame" />
            <ImagesCarousel tconst={params.tconst} type="behind_the_scenes" />
            <ImagesCarousel tconst={params.tconst} type="event" />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(
  { params }: { params: { tconst: string } },
): Promise<Metadata> {
  const movie = await imdb.getDetails(params.tconst);

  if (!movie || !movie.primaryTitle) {
    return {
      title: "Title not found | CineCatalogue",
      description: "Title cannot be found.",
    };
  }

  return {
    title: `${movie.primaryTitle} | CineCatalogue`,
    description: movie.plot || "No description available.",
    openGraph: {
      title: movie.primaryTitle,
      description: movie.plot,
      images: [movie.image],
    },
  };
}
