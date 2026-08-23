import CountdownTimer from "@/components/CountdownTimer";

const features = [
  {
    title: "Discover",
    desc: "Surface your next game before everyone else finds it.",
  },
  {
    title: "Rate",
    desc: "Score what you played, on your own terms.",
  },
  {
    title: "Review",
    desc: "Say what you actually thought — no fluff required.",
  },
  {
    title: "Track",
    desc: "Every game you've played, in one running log.",
  },
  {
    title: "Connect",
    desc: "Follow players whose taste actually matches yours.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.15),transparent_60%)]" />
        <span className="relative text-xs tracking-[0.3em] text-[#A78BFA] font-mono mb-6">
          LAUNCHING SEP 12, 2026
        </span>
        <h1 className="relative font-display text-6xl md:text-8xl font-bold tracking-tight">
          PLAYTHRUU
        </h1>
        <p className="relative mt-4 text-lg md:text-2xl text-gray-300 font-display">
          Your Gaming Journey.
        </p>
        <p className="relative mt-3 text-sm md:text-base text-gray-500 max-w-md">
          Discover games. Track what you play. Share your story.
        </p>
        <div className="relative mt-10 flex gap-4">
          
            href="#waitlist"
            className="px-6 py-3 rounded-full bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition"
          >
            Join the Waitlist
          </a>
          
            href="#what-is"
            className="px-6 py-3 rounded-full border border-white/20 text-gray-200 font-medium hover:border-white/50 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* WHAT IS PLAYTHRUU */}
      <section id="what-is" className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold">
          Your gaming life, in one place.
        </h2>
        <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
          Most people who play games are also the people talking about
          games — comparing notes, chasing recommendations, keeping tabs on
          what everyone else is into. PlayThruu is where that actually
          lives: one running record of what you've played, what you
          thought, and what's next.
        </p>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#171722] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-[#7C3AED]/40 transition"
            >
              <h3 className="font-display text-lg font-semibold text-[#A78BFA]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-snug">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* APP PREVIEW */}
      <section className="px-6 py-24 md:py-32 max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold">
          A look inside.
        </h2>
        <div className="mt-10 aspect-video rounded-2xl bg-[#171722] border border-white/10 flex items-center justify-center">
          <span className="text-gray-600 font-mono text-sm">
            [ app preview coming soon ]
          </span>
        </div>
      </section>

      {/* WHY PLAYTHRUU */}
      <section className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold">
          Not a store. Not a wiki. Yours.
        </h2>
        <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
          Game stores want you to buy. Review sites want you to scroll.
          PlayThruu is built around one person's actual history with
          games — what you've finished, what you dropped, and what you'd
          tell a friend to play next.
        </p>
      </section>

      {/* COMING SOON / WAITLIST */}
      <section
        id="waitlist"
        className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold">
          Coming Soon
        </h2>
        <p className="mt-4 text-gray-500">
          PlayThruu launches September 12, 2026.
        </p>

        <div className="mt-8 flex justify-center">
          <CountdownTimer />
        </div>

        <form className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 rounded-full bg-[#171722] border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7C3AED] transition"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition whitespace-nowrap"
          >
            Join the Waitlist
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span className="font-display text-white">PLAYTHRUU</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition">Twitter</a>
            <a href="#" className="hover:text-gray-300 transition">Instagram</a>
            <a href="#" className="hover:text-gray-300 transition">Discord</a>
          </div>
          <span>© 2026 PlayThruu</span>
        </div>
      </footer>
    </main>
  );
}