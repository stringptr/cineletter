import { Metadata } from "next";
import process from "node:process";
import { guest, testConnection } from "@/db/index.ts";

import { BannerImages, ImagesCarousel } from "./images.tsx";
import { Details, PrimaryPoster, Titles } from "./titles.tsx";
import { Crew } from "./crew.tsx";
import { imdb } from "@/services/imdb.ts";

export default async function Page(
  { params }: { params: Promise<{ title_id: string }> },
) {
  await testConnection(guest, "guest");
  const { title_id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/title/${title_id}`,
    {
      cache: "force-cache",
      next: { tags: [`title-${title_id}`] },
    },
  );

  const { data } = await res.json();
  return (
    <div>{{ data }}</div>
    //   <div className="px-auto w-full text-white">
    //     <BannerImages title_id={params.title_id} />
    //     <div className="grid grid-cols-2 gap-20 w-[80vw]">
    //       <div className="ml-auto max-w-content pt-4">
    //         <PrimaryPoster title_id={params.title_id} />
    //       </div>
    //       <div className="mr-auto flex flex-col w-[600px]">
    //         <Titles title_id={params.title_id} />
    //         <div className="mt-8 ml-[5px] flex flex-col gap-8">
    //           <Details title_id={params.title_id} />
    //           <Crew title_id={params.title_id} />
    //           <ImagesCarousel title_id={params.title_id} type="poster" />
    //           <ImagesCarousel title_id={params.title_id} type="still_frame" />
    //           <ImagesCarousel
    //             title_id={params.title_id}
    //             type="behind_the_scenes"
    //           />
    //           <ImagesCarousel title_id={params.title_id} type="event" />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
  );
}

// export async function generateMetadata(
//   { params }: { params: { title_id: string } },
// ): Promise<Metadata> {
//   const movie = await imdb.getDetails(params.title_id);
//
//   if (!movie || (!movie.title && !movie.original_title)) {
//     return {
//       title: "Title not found | CineCatalogue",
//       description: "Title not found.",
//     };
//   }
//
//   return {
//     title: `${movie.title} | CineCatalogue`,
//     description: movie.plot || "No description available.",
//     openGraph: {
//       title: movie.primaryTitle,
//       description: movie.plot,
//       images: [movie.image],
//     },
//   };
// }
