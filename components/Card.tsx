import Link from "next/link";

export default function Card({ title, genre, year, poster, director, description }: any) {
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex bg-[#ffffff] backdrop-blur-sm rounded-xl shadow-md overflow-hidden w-full max-w-4xl hover:scale-[1.02] transition-transform duration-300">
      {/* Poster di kiri */}
      <img
        src={poster}
        alt={title}
        className="w-48 h-64 object-cover flex-shrink-0"
      />

      {/* Detail di kanan */}
      <div className="px-5 pb-5 pt-0 flex flex-col text-[#08092e]">
        <div>
          {/* Judul clickable */}
          <Link href={`/movies/${slug}`} className="no-underline cursor-pointer">
            <h3 className="font-bold text-4xl mt-5 mb-1 text-[#f00707] hover:text-[#ff6b6b]">
              {title}
            </h3>
          </Link>

          <p className="text-md text-gray-700 mb-3">
            {year} • Directed by <span className="font-semibold">{director}</span>
          </p>
          <p className="text-gray-800 text-sm leading-relaxed mb-4">{description}</p>
        </div>

        {/* Genre section */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {genre.map((g: string, index: number) => (
            <Link
              key={index}
              href={`/genre/${g.toLowerCase()}`}
              className="no-underline cursor-pointer bg-[#121463] text-white px-3 py-1 rounded-full text-md hover:bg-[#0929ab] transition"
            >
              {g}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}