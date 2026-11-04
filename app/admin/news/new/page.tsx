import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase-server";
import { createArticleFromJson } from "../actions";

export const metadata: Metadata = {
  title: "New story",
  robots: { index: false, follow: false },
};

export default async function NewArticle({ searchParams }: PageProps<"/admin/news/new">) {
  const { user, isAdmin } = await getAdmin();
  if (!user || !isAdmin) redirect("/admin/login");
  const sp = await searchParams;

  return (
    <main className="admin-page">
      <p><Link href="/admin/news" className="text-link">← Back to News</Link></p>
      <h1>New article</h1>
      <p className="admin-muted">
        New articles enter the review queue. Paste one article object or an array of articles. Use confirmed, source-backed facts and official/licensed images only.
      </p>
      {typeof sp.error === "string" && <p className="admin-notice is-error" role="alert">{sp.error}</p>}
      <form action={createArticleFromJson} className="admin-form">
        <label className="is-wide">
          Article JSON
          <textarea name="article" rows={28} required spellCheck={false} placeholder={'{\n  "slug": "example-story",\n  "title": "Headline"\n}\n\n—or an array of articles—'} />
        </label>
        <div className="is-wide"><button className="admin-button is-primary">Create review draft(s)</button></div>
      </form>
    </main>
  );
}
