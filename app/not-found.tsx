import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function NotFound() {
  return (
    <main className="not-found">
      <BrandMark className="brand-mark" />
      <h1>404</h1>
      <p>This page didn&rsquo;t make it into anyone&rsquo;s log.</p>
      <Link href="/" className="button button-primary">
        Back to PlayThruu
      </Link>
    </main>
  );
}
