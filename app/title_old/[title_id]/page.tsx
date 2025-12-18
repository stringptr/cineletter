"use client";
import { useParams } from "next/navigation";

export default function MovieDetailPage() {
  const { slug } = useParams();

  const movies: Record<string, any> = {
    wicked: {
      title: "Wicked",
      genre: ["Musical", "Fantasy", "Drama"],
      year: "2024",
      director: "Jon M Chu",
      description:
        "In the land of Oz, ostracized and misunderstood green-skinned Elphaba is forced to share a room with the popular aristocrat Glinda at Shiz University, and the two's unlikely friendship is tested as they begin to fulfill their respective destinies.",
      poster: "/wicked.jpg",
      backdrop: "/wicked_bd.jpg",
      rating: "8.3",
      whereToWatch: ["Netflix", "Apple TV", "Amazon Prime"],
    },
  };

  const movie = movies[slug];
  if (!movie) {
    return <p className="text-white text-center py-20">Movie not found!</p>;
  }

  return (
    <main className="min-h-screen bg-[#050621] text-white flex justify-center px-10 py-16">
      <div className="flex w-full max-w-6xl gap-10">
        {/* LEFT: Poster + Watch */}
        <aside className="w-1/3 md:w-1/4 sticky top-24 h-fit">
          <img
            src={movie.poster}
            alt={movie.title}
            className="rounded-xl shadow-lg w-full object-cover"
          />
          <div className="mt-6 bg-[#ffffff0a] p-4 rounded-xl backdrop-blur-md border border-[#ffffff1a]">
            <h3 className="text-lg font-semibold mb-3">Where to Watch</h3>
            <ul className="space-y-2">
              {movie.whereToWatch.map((platform: string, i: number) => (
                <li
                  key={i}
                  className="text-sm bg-[#ff3b3b] text-white px-3 py-1 rounded-md inline-block"
                >
                  {platform}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* RIGHT: Detail (dengan backdrop edge-blur frame) */}
        <section className="flex-1">
          {/* Image-frame container */}
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            {/* 1) Blurred layer untuk bingkai tepi */}
            <div
              className="absolute inset-0 -z-10 transform scale-105"
              style={{
                backgroundImage: `url(${movie.backdrop})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(24px) saturate(0.95)",
              }}
              aria-hidden="true"
            />

            {/* 2) Overlay gradasi untuk transisi halus */}
            <div
              className="absolute inset-0 -z-5 bg-gradient-to-b from-transparent via-[#050621cc] to-[#050621ff]"
              aria-hidden="true"
            />

            {/* 3) Gambar utama tajam di tengah */}
            <div className="relative flex items-center justify-center">
              <img
                src={movie.backdrop}
                alt={`${movie.title} backdrop`}
                className="w-full md:w-[85%] lg:w-[75%] rounded-xl object-cover shadow-2xl"
              />
            </div>
          </div>

          {/* Konten teks di bawah */}
          <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
          <p className="text-gray-300 mb-6">
            {movie.year} • Directed by{" "}
            <span className="font-semibold text-white">{movie.director}</span>
          </p>

          <p className="text-gray-200 leading-relaxed mb-6">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genre.map((g: string, i: number) => (
              <span
                key={i}
                className="bg-[#ffffff1a] text-white px-3 py-1 rounded-full text-xs"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#ff3b3b] text-white px-4 py-2 rounded-lg hover:bg-[#ff6b6b] transition">
              Add to Watchlist
            </button>
            <button className="bg-[#ffffff1a] text-white px-4 py-2 rounded-lg hover:bg-[#ffffff33] transition">
              Share
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

