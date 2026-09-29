import SiteNav from "@/components/site/SiteNav";
import Hero from "@/components/site/Hero";
import LogStory from "@/components/site/LogStory";
import GamePageShowcase from "@/components/site/GamePageShowcase";
import FriendsRows from "@/components/site/FriendsRows";
import ProfileShowcase from "@/components/site/ProfileShowcase";
import NewsPreview from "@/components/site/NewsPreview";
import WaitlistSection from "@/components/site/WaitlistSection";
import SiteFooter from "@/components/site/SiteFooter";
import { supabase } from "@/lib/supabase";
import { getPublishedArticles } from "@/lib/news";

export const revalidate = 300;

// The story, in the order someone would use PlayThruu: log a game, find
// its page, see your friends, build your profile, read the news, join.
export default async function Home() {
  const [{ count: memberCount }, articles] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    getPublishedArticles(),
  ]);

  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <LogStory />
        <GamePageShowcase />
        <FriendsRows />
        <ProfileShowcase />
        <NewsPreview articles={articles} />
        <WaitlistSection memberCount={memberCount} />
      </main>
      <SiteFooter />
    </>
  );
}
