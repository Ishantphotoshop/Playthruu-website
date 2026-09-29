import Link from "next/link";
import { Stamp, Wordmark } from "@/components/ui";

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <Wordmark size="lg" />
      <Stamp status="dropped" />
      <h1 className="display-2">This page isn&rsquo;t on anyone&rsquo;s shelf.</h1>
      <p>The link may be old, or the page moved.</p>
      <Link href="/" className="btn btn--accent">
        Back to PlayThruu
      </Link>
    </main>
  );
}
