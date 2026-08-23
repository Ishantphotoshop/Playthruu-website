export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B12] text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
        PLAYTHRUU
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-300">
        Your Gaming Journey.
      </p>
      <p className="mt-2 text-sm md:text-base text-gray-400 max-w-md">
        Discover games. Track what you play. Share your story.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 rounded-full bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition">
          Join the Waitlist
        </button>
        <button className="px-6 py-3 rounded-full border border-gray-500 text-gray-200 font-medium hover:border-white transition">
          Learn More
        </button>
      </div>
    </main>
  );
}
