"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const movies = [
    { id: 1, title: "Wicked", rating: "9.3", poster: "/wicked.jpg", slug: "wicked" },
    { id: 2, title: "Wicked: For Good", rating: "0.0", poster: "/wicked_fg.jpg", slug: "wicked-for-good" },
    { id: 3, title: "Alice in Wonderland", rating: "9.0", poster: "/alice.jpg", slug: "alice-in-wonderland" },
    { id: 4, title: "The Nutcracker", rating: "9.2", poster: "/nutcracker.jpg", slug: "the-nutcracker" },
    { id: 5, title: "Barbie", rating: "9.5", poster: "/barbie.jpg", slug: "barbie" },
    { id: 6, title: "Beauty and the Beast", rating: "9.8", poster: "/beautyandthebeast.jpg", slug: "beauty-and-the-beast" },
  ];

  const infoBoxes = [
    { title: "About Us", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Our Mission", text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { title: "Top Genres", text: "Action, Drama, Comedy, Sci-Fi, Romance, Thriller." },
    { title: "Community", text: "Join our community of movie lovers around the world." },
    { title: "Latest News", text: "Stay updated with the latest in entertainment." },
    { title: "Support", text: "Need help? Reach out to our support team anytime." },
  ];

  return (
    <main className="text-white min-h-screen">

      {/* HERO SECTION */}
      <section className="relative -mt-20 h-[95vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/home.jpg"
          alt="Hero backdrop"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">Welcome to DBMSATRIA</h1>
          <p className="text-gray-300 mb-8 text-lg">Discover. Watch. Share your favorite movies.</p>

          {/* BUTTON OPEN MODAL */}
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#ff3b3b] px-6 py-3 rounded-lg text-white text-lg font-semibold hover:bg-[#ff6b6b] transition"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* RECOMMENDED MOVIES */}
      <section className="py-20 px-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Recommended Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-lg"
            >
              <Image
                src={movie.poster}
                alt={movie.title}
                width={300}
                height={450}
                className="object-cover w-full h-full group-hover:opacity-40 transition"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <h3 className="text-2xl font-semibold text-white">{movie.title}</h3>
                <div className="flex text-2xl items-center mt-1 text-yellow-400">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{movie.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INFO BOXES */}
      <section className="py-16 px-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {infoBoxes.map((box, i) => (
            <div
              key={i}
              className="bg-[#101133] p-6 rounded-2xl border border-[#ffffff1a] hover:bg-[#1a1b4d] transition shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-3">{box.title}</h3>
              <p className="text-gray-300 text-sm">{box.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL — langsung pakai modalmu */}
      <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

    </main>
  );
}