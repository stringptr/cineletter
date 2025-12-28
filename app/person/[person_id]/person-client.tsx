"use client";

import Image from "next/image";
import { Calendar, Film, MapPin, Star } from "lucide-react";
import { bigint } from "zod";

export default function PersonDetailPage(
  { person }: any,
) {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white -mt-20 pt-32 pb-20">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* SECTION ATAS */}
        <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
          {/* FOTO PERSON (KECIL + BADGE ROLE) */}
          <div className="relative w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-[#ffffff1a] flex-shrink-0 mx-auto md:mx-0">
            {/* BADGE ROLE */}
            <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#ffffff1a]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff3b3b]">
                {person.primary_professions?.map((p) => p.primary_professions)}
              </span>
            </div>

            <Image
              src={person.image ?? null}
              alt={person.person_name}
              fill
              className="object-cover"
            />
          </div>

          {/* INFO DETAIL */}
          <div className="flex-1">
            <h1 className="text-5xl font-black mb-2 tracking-tight">
              {person.person_name}
            </h1>
            <p className="text-[#ff3b3b] font-bold text-lg mb-6 uppercase tracking-widest">
              {person.person_name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
              <div
                hidden={!person.death_year || !person.birth_year}
                className="flex items-center gap-3"
              >
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p
                    hidden={!person.birth_year}
                    className="text-[10px] text-gray-500 uppercase"
                  >
                    Birth Date
                  </p>
                  <p className="text-sm font-medium">{person.birth_year}</p>
                  <p
                    hidden={!person.death_year}
                    className="text-[10px] text-gray-500 uppercase"
                  >
                    Birth Date
                  </p>
                  <p className="text-sm font-medium">{person.death_year}</p>
                </div>
              </div>

              <div className="hidden items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p hidden className="text-[10px] text-gray-500 uppercase">
                    Nationality
                  </p>
                  <p className="text-sm font-medium">{person.nationality}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="hidden w-5 h-5 text-yellow-500 fill-yellow-500" />
                <div hidden>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Famous Character
                  </p>
                  <p className="text-sm font-bold text-yellow-500">
                    {person.famousCharacter}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Top Genres
                  </p>
                  <div className="flex gap-2 mt-1">
                    {person.top_genres?.map((genre: any) => (
                      <span
                        key={genre}
                        className="text-[10px] bg-[#ffffff14] px-2 py-0.5 rounded border border-[#ffffff1a]"
                      >
                        {genre.genre}
                        ({genre.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#ffffff1a] pt-6">
              <h2 className="text-lg font-bold mb-3 uppercase tracking-tighter">
                Biography
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm font-light italic">
                "{person.biography}"
              </p>
            </div>
          </div>
        </div>

        {/* FILMOGRAPHY */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tighter">
              Known For
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#ffffff1a] to-transparent" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {person.movies?.map((movie: any) => (
              <div key={movie.title_id} className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-[#ffffff1a] mb-2 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#ff3b3b1a]">
                  <Image
                    src={movie.poster ?? null}
                    alt={movie.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#ffffff1a]">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold">
                      {movie.average_rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs font-bold truncate group-hover:text-[#ff3b3b] transition-colors">
                  {movie.title}
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {movie.year}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
