import { Metadata } from "next";
import Image from "next/image";

import { BannerImages, ImagesCarousel } from "./images.tsx";
import { Details, Titles } from "./titles.tsx";
import { tmdb } from "@/services/tmdb.ts";
import { imdb } from "@/services/imdb.ts";

export default async function Page({ params }: { params: { tconst: string } }) {
  const id = await tmdb.idFromImdb(params.tconst);
  const dataImages = await tmdb.getImages(id);

  return (
    <div className="w-full bg-black text-white">
      <BannerImages data={dataImages} />
      <div className="pt-[24rem] content-center mx-auto align-center">
        <Titles tconst={params.tconst} />
        <Details tconst={params.tconst} />
        <ImagesCarousel tconst={params.tconst} type="poster" />
        <ImagesCarousel tconst={params.tconst} type="still_frame" />
        <ImagesCarousel tconst={params.tconst} type="behind_the_scenes" />
        <ImagesCarousel tconst={params.tconst} type="event" />
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
