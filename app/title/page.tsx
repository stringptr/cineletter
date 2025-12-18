"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function MoviesPage() {
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [year, setYear] = useState("All");
  const [rating, setRating] = useState("All");

  const dummyMovies = [
    {
      id: 1,
      title: "Inception",
      rating: 8.8,
      year: 2010,
      genre: "Sci-Fi",
      poster:
        "/posters/wicked.jpg",
    },
    {
      id: 2,
      title: "Interstellar",
      rating: 8.6,
      year: 2014,
      genre: "Sci-Fi",
      poster:
        "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqoNMq13X3QpV7.jpg",
    },
    {
      id: 3,
      title: "The Dark Knight",
      rating: 9.0,
      year: 2008,
      genre: "Action",
      poster:
        "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white px-6 pt-28 pb-10">
      {/* TITLE */}
      <h1 className="text-4xl font-extrabold mb-8">Movies</h1>

      {/* FILTER BAR */}
      <div className="bg-[#ffffff0d] border border-[#ffffff1a] p-5 rounded-xl shadow-lg backdrop-blur-xl mb-10 flex flex-wrap gap-4">
        {/* Sort By */}
        <FilterDropdown
          label="Sort by"
          value={sortBy}
          setValue={setSortBy}
          options={["Popular", "Top Rated", "Newest"]}
        />

        {/* Genre */}
        <FilterDropdown
          label="Genre"
          value={genre}
          setValue={setGenre}
          options={[
            "All",
            "Action",
            "Adventure",
            "Comedy",
            "Drama",
            "Horror",
            "Romance",
            "Sci-Fi",
            "Thriller",
          ]}
        />

        {/* Year */}
        <FilterDropdown
          label="Year"
          value={year}
          setValue={setYear}
          options={[
            "All",
            "2020s",
            "2010s",
            "2000s",
            "1990s",
            "1980s",
            "Before 1980",
          ]}
        />

        {/* Rating */}
        <FilterDropdown
          label="Rating"
          value={rating}
          setValue={setRating}
          options={["All", "9+", "8+", "7+", "6+"]}
        />
      </div>

      {/* MOVIE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {dummyMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-[#ffffff0d] border border-[#ffffff1a] p-3 rounded-xl shadow transition hover:scale-105 hover:bg-[#ffffff14]"
          >
            <Image
              src={movie.poster}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg w-full h-auto"
            />
            <h3 className="text-lg font-semibold mt-3">{movie.title}</h3>
            <p className="text-sm text-gray-300">⭐ {movie.rating}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ======================
   FILTER DROPDOWN COMPONENT
   ====================== */
function FilterDropdown({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative select-none">
      <button
        className="flex items-center gap-2 bg-[#ffffff14] px-4 py-2 rounded-lg border border-[#ffffff1a] hover:bg-[#ffffff22] transition"
        onClick={() => setOpen(!open)}
      >
        {label}: <span className="font-semibold">{value}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute mt-2 left-0 w-40 bg-[#0f0f3a] border border-[#ffffff1a] rounded-lg shadow-xl p-2 z-50">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-3 py-2 text-sm hover:bg-[#1b1b5a] cursor-pointer rounded"
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}