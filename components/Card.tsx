import Link from "next/link";
import { searchDetail } from "@/types/title";

type CardProps = {
  title_data: searchDetail;
};

export default function Card({ title_data }: CardProps) {
  const {
    title_id,
    title,
    tagline,
    overview,
    rate_count,
    average_rating,
    start_year,
    type,
    relevance,
    title_akas,
  } = title_data;

  return (
    <Link
      href={`/title/${title_id}`}
      className="no-underline group"
    >
      <div className="flex gap-5 py-6 border-b border-white/10 hover:bg-white/5 transition">
        {/* POSTER */}
        <div className="w-20 flex-shrink-0">
          <div className="aspect-[2/3] bg-[#1a1a5a] rounded-md overflow-hidden shadow">
            <img
              src={`/posters/${title_id}.jpg`}
              alt={title ?? "Untitled"}
              className="w-full h-full object-cover"
              // onError={(e) => {
              //   e.currentTarget.src = "/placeholder-poster.jpg";
              // }}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-2 text-white max-w-3xl">
          {/* TITLE LINE */}
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-xl font-semibold group-hover:text-[#ff6b6b] transition">
              {title ?? "Untitled"}
            </h3>
            {start_year && (
              <span className="text-white/50 text-lg">
                {start_year}
              </span>
            )}
          </div>

          {/* AKA TITLES */}
          {title_akas?.length > 0 && (
            <p className="text-sm text-white/60 line-clamp-2">
              Alternative titles: {title_akas
                .slice(0, 4)
                .map((a) => a.title)
                .join(", ")}
              {title_akas.length > 4 && " …"}
            </p>
          )}

          {/* META */}
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="capitalize">{type}</span>

            <span className="flex items-center gap-1 text-yellow-400 font-medium">
              ★ {average_rating?.toFixed(1) ?? "—"}
            </span>

            {rate_count && (
              <span>
                {rate_count.toLocaleString()} ratings
              </span>
            )}
          </div>

          {/* TAGLINE / OVERVIEW */}
          {(tagline || overview) && (
            <p className="text-sm text-white/70 line-clamp-2">
              {tagline ?? overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
