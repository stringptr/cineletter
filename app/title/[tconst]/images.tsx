import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { tmdb } from "@/services/tmdb.ts";
import { imdb } from "@/services/imdb.ts";

export async function BannerImages(
  { tconst }: { tconst: string },
) {
  const id = await tmdb.idFromImdb(tconst);
  const data = await tmdb.title.getImages(id);

  if (data !== null) {
    const banner = data?.backdrops[0];
    return (
      <div className="z-0 absolute h-[65vh] overflow-hidden shadow-2xl ml-[9%] w-[80%]">
        <Image
          fill
          src={`https://image.tmdb.org/t/p/original${banner?.file_path}`}
          alt="BannerBackground"
          className="object-cover w-full h-full"
          priority
        />

        <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute left-0 h-full w-40 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute right-0 h-full w-40 bg-gradient-to-l from-black via-black/60 to-transparent" />
      </div>
    );
  }
}

export async function ImagesCarousel(
  { tconst, type }: { tconst: string; type: string },
) {
  const data = await imdb.getImages(tconst);

  const images = data?.images?.filter((img: any) => img.type === type);

  if (images.length === 0) {
    return;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold">
        {type.split("_").map((word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ")}
      </h2>

      <Carousel className="relative w-[80%] max-w-xl mx-auto">
        <CarouselContent>
          {images
            ?.map((
              img: any,
              idx: number,
            ) => (
              <CarouselItem key={idx} className="my-auto w-full basis-1/3">
                <Image
                  width="400"
                  height="400"
                  src={img.url}
                  alt={`Image-${idx}`}
                />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute top-1/2 -translate-y-1/2" />
      </Carousel>
    </>
  );
}
