"use client";

import Link from "next/link";
import { PlayCircle, Star } from "lucide-react";
import { useState } from "react";

export default function DetailMovie({ movie }: { movie: any }) {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedRating, setSelectedRating] = useState(0);

  // --- LINKS ---
  const poster =
    movie.links?.find((l: any) => l.link_type === "poster")?.link ??
      "/poster-placeholder.jpg";

  const backdrop =
    movie.links?.find((l: any) => l.link_type === "backdrop")?.link ??
      poster;

  // --- BASIC META ---
  const year = movie.start_year &&
    (movie.end_year
      ? `${movie.start_year}–${movie.end_year}`
      : movie.start_year);

  const runtime = movie.runtime_minute ? `${movie.runtime_minute} min` : null;

  const rating = movie.average_rating ? movie.average_rating.toFixed(1) : null;

  // --- TABS ---
  const tabs = [
    { id: "details", label: "DETAILS" },
    { id: "genres", label: "GENRES" },
    { id: "production", label: "PRODUCTION" },
    { id: "languages", label: "LANGUAGES" },
    { id: "regions", label: "REGIONS" },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden -mt-20">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[#0a0a0a] pointer-events-none" />
      <div
        className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundPosition: "center top",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 50%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 50%, black 85%, transparent 100%)",
          opacity: 0.5,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60 pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col lg:flex-row max-w-7xl mx-auto px-6 pt-40 pb-10 gap-10">
        {/* LEFT */}
        <div className="flex flex-col gap-6 w-64 mx-auto lg:mx-0">
          <img
            src={poster}
            alt={movie.title ?? "Poster"}
            className="w-full rounded-xl shadow-lg"
          />

          {(movie.networks?.length > 0 ||
            movie.production_companies?.length > 0) && (
            <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
                Available / Produced by
              </h3>
              <div className="space-y-1 text-sm text-gray-200">
                {movie.networks?.map((n: any) => (
                  <div key={`net-${n.network_id}`}>{n.network_name}</div>
                ))}
                {movie.production_companies?.map((c: any) => (
                  <div key={`co-${c.company_id}`}>{c.company_name}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER */}
        <div className="flex-1">
          <h1 className="text-5xl lg:text-6xl font-black mb-4">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-6">
            {year && <span>{year}</span>}
            {runtime && (
              <>
                <span>•</span>
                <span>{runtime}</span>
              </>
            )}
            {rating && (
              <>
                <span>•</span>
                <span className="text-yellow-400 font-bold">
                  ⭐ {rating}
                </span>
              </>
            )}
          </div>

          {movie.overview && (
            <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
              {movie.overview}
            </p>
          )}

          {/* GENRES QUICK */}
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres.map((g: string) => (
                <Link
                  key={g}
                  href={`/title/explore?genre=${
                    decodeURIComponent(
                      g.toLowerCase(),
                    )
                  }`}
                  className="bg-[#2a2a2a] px-4 py-1.5 rounded-full text-sm border border-white/10 hover:bg-[#ff3b3b] transition no-underline"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* TABS */}
          <div className="border-b border-white/20 mb-6 flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-[11px] font-bold rounded-lg tracking-widest ${
                  activeTab === t.id
                    ? "bg-[#2a2a2a] text-white border-b-2 border-[#ff3b3b]"
                    : "bg-[#2a2a2a] text-gray-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          {activeTab === "details" && (
            <div className="flex flex-wrap gap-4 text-sm">
              {movie.status && <Detail label="Status" value={movie.status} />}
              {movie.type && <Detail label="Type" value={movie.type} />}
              {movie.season_number && (
                <Detail label="Seasons" value={movie.season_number} />
              )}
              {movie.episode_number && (
                <Detail label="Episodes" value={movie.episode_number} />
              )}
            </div>
          )}

          {activeTab === "genres" && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g: string) => (
                <span
                  key={g}
                  className="px-3 py-1.5 bg-[#2a2a2a] rounded-md border border-white/10 text-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {activeTab === "production" && (
            <div className="flex flex-wrap gap-2">
              {movie.production_companies.map((c: any) => (
                <span
                  key={c.company_id}
                  className="px-3 py-1.5 bg-[#2a2a2a] rounded-md border border-white/10 text-sm"
                >
                  {c.company_name}
                </span>
              ))}
            </div>
          )}

          {activeTab === "languages" && (
            <div className="flex flex-wrap gap-2">
              {movie.spoken_languages.map((l: any) => (
                <span
                  key={l.spoken_language_id}
                  className="px-3 py-1.5 bg-[#2a2a2a] rounded-md border border-white/10 text-sm"
                >
                  {l.spoken_language_name}
                </span>
              ))}
            </div>
          )}

          {activeTab === "regions" && (
            <div className="flex flex-wrap gap-2">
              {movie.regions.map((r: any, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#2a2a2a] rounded-md border border-white/10 text-sm"
                >
                  {r.code}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="bg-[#1a1a1a]/60 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">
              CineLetter Rating
            </h3>
            <div className="flex items-center gap-4">
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
              <span className="text-3xl font-bold">
                {rating ?? "–"}
              </span>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/60 p-5 rounded-2xl border border-white/10">
            <h3 className="text-xs font-bold text-[#ff3b3b] uppercase mb-3">
              Rate this title
            </h3>
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setSelectedRating(s)}
                  className={`w-7 h-7 cursor-pointer ${
                    s <= selectedRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <textarea
              placeholder="Write your review..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm mb-3 resize-none h-20"
            />
            <button className="w-full bg-[#ff3b3b] py-2.5 rounded-lg font-semibold">
              Add Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex gap-2 bg-white/5 px-3 py-1 rounded-md border border-white/5">
      <span className="text-gray-500 uppercase text-xs">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
