import type { Metadata } from "next";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Delete Your PlayThruu Account",
  description: "How to request deletion of your PlayThruu account and associated data.",
};

export default function DeleteAccountPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="page page--narrow legal-page">
        <h1>Delete Your PlayThruu Account</h1>
        <p>
          You can request deletion of your PlayThruu account without
          installing the app or signing in.
        </p>

        <h2>Request account deletion</h2>
        <p>
          Email{" "}
          <a href="mailto:hello@playthruu.com?subject=Account%20deletion%20request">
            hello@playthruu.com
          </a>{" "}
          from the email address associated with your PlayThruu account and
          ask us to delete it. We normally complete deletion requests within
          30 days.
        </p>

        <h2>What is deleted</h2>
        <p>
          When your account is deleted, we remove your profile, gaming diary,
          logs, reviews, comments, lists, follows, and messages from our
          database. Your account login is also removed.
        </p>

        <h2>What we retain</h2>
        <p>
          We keep account information only while your account exists. If you
          joined the PlayThruu waitlist separately, that entry is kept until
          launch or until you ask us to delete it.
        </p>

        <h2>Permanent deletion</h2>
        <p>
          Account deletion is permanent. Once your account and associated
          data have been deleted, they cannot be restored.
        </p>

        <p>
          You may also delete your account yourself in the PlayThruu app:
          open <strong>Settings</strong> and select <strong>Delete my account</strong>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
