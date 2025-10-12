"use client";

import { useEffect, useState } from "react";
import { imdb } from "@/services/imdb.ts";

export function Crew({ tconst }: { tconst: string }) {
  const [data, setData] = useState<any>(null);
  const [showCrew, setShowCrew] = useState("creative");

  useEffect(() => {
    imdb.getDetails(tconst).then(setData);
  }, [tconst]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row w-full gap-4">
        <h5
          onClick={() => setShowCrew("creative")}
          className={`text-lg ${
            showCrew === "creative" ? "border-b" : "border-0"
          }`}
        >
          Creatives
        </h5>
        <h5
          onClick={() => setShowCrew("actors")}
          className={`text-lg ${
            showCrew === "actors" ? "border-b" : "border-0"
          }`}
        >
          Actors
        </h5>
        <h5
          onClick={() => setShowCrew("genres")}
          className={`text-lg ${
            showCrew === "genres" ? "border-b" : "border-0"
          }`}
        >
          Genres
        </h5>
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        {showCrew === "actors" &&
          data.stars?.map((person: any) => (
            <a
              href={`/crew/${person.id}`}
              key={person.id}
              className="border-1 px-2 py-1 rounded-sm hover:bg-white hover:text-black"
            >
              {person.displayName}
            </a>
          ))}
        {showCrew === "creative" &&
          data.writers?.map((person: any) => (
            <a
              href={`/crew/${person.id}`}
              key={person.id}
              className="border-1 px-2 py-1 rounded-sm hover:bg-white hover:text-black"
            >
              {person.displayName}
            </a>
          ))}
        {showCrew === "genres" &&
          data.interests.filter((interest: any) => interest.isSubgenre === true)
            .map((interest: any) => (
              <a
                href={`/subgenre/${interest.id}`}
                key={interest.id}
                className="border-1 px-2 py-1 rounded-sm hover:bg-white hover:text-black"
              >
                {interest.name}
              </a>
            ))}
      </div>
    </div>
  );
}
