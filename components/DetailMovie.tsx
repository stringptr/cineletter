import Link from "next/link";

export default function DetailMovie({ movie }: { movie: any }) {
  const poster =
    movie.links?.find((l: any) => l.link_type === "poster")?.link ??
    "/poster-placeholder.jpg";

  const backdrop =
    movie.links?.find((l: any) => l.link_type === "backdrop")?.link ??
    poster;

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backdrop})`,
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          opacity: 0.9,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row max-w-7xl mx-auto px-6 py-20 gap-10 items-start">
        {/* LEFT: Poster */}
        <div className="w-full md:w-1/3 max-w-sm">
          <img
            src={poster}
            alt={movie.title ?? "Poster"}
            className="w-full rounded-2xl shadow-2xl"
          />

          {(movie.networks?.length > 0 || movie.production_companies?.length > 0) && (
            <div className="mt-6 bg-[#101010cc] backdrop-blur-md p-4 rounded-xl border border-[#ffffff1a]">
              <h3 className="text-lg font-semibold mb-2">Production</h3>
              <ul className="text-sm text-gray-200 space-y-1">
                {movie.networks?.map((n: any) => (
                  <li key={n.network_id}>{n.network_name}</li>
                ))}
                {movie.production_companies?.map((c: any) => (
                  <li key={c.company_id}>{c.company_name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="flex-1 relative z-20 md:pt-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-6">
            {movie.start_year && <span>{movie.start_year}</span>}
            {movie.runtime_minute && (
              <>
                <span>•</span>
                <span>{movie.runtime_minute} min</span>
              </>
            )}
            {movie.average_rating && (
              <>
                <span>•</span>
                <span className="text-yellow-400 font-bold">
                  ⭐ {movie.average_rating.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {movie.overview && (
            <p className="text-gray-200 leading-relaxed mb-8 max-w-2xl drop-shadow-md">
              {movie.overview}
            </p>
          )}

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres.map((g: string) => (
                <Link
                  key={g}
                  href={`/genre/${g.toLowerCase()}`}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-xs hover:bg-white/40 transition no-underline"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button className="bg-[#ff1f1f] text-white px-5 py-2 rounded-lg hover:bg-[#ff6b6b] transition">
              Add to Watchlist
            </button>
            <button className="bg-white/20 px-5 py-2 rounded-lg hover:bg-white/30 transition">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
