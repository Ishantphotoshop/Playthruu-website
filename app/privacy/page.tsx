import type { Metadata } from "next";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicy() {
  return (
    <>
    <SiteNav />
    <main id="main" className="page page--narrow legal-page">

      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: October 17, 2026</p>

      <p>
        PlayThruu (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a gaming diary: you
        log the games you play, rate and review them, keep a backlog and
        lists, and follow friends. This policy covers the PlayThruu app (on
        the web at app.playthruu.com and on Android) and this website. It is
        written in plain language.
      </p>

      <h2>What we collect</h2>
      <h3>When you create an account</h3>
      <ul>
        <li>Your email address and a password (the password is handled by our login provider and is never visible to us in plain text).</li>
        <li>A username and display name you choose.</li>
        <li>Optionally: a profile picture, a short bio, and a header image.</li>
      </ul>
      <h3>What you add while using the app</h3>
      <ul>
        <li>The games you log, rate, like, replay, put in your backlog, or mark as playing, with the dates and hours you enter.</li>
        <li>Reviews, comments, and lists you write.</li>
        <li>Who you follow and who follows you.</li>
        <li>Messages you send to other users, including any photos or GIFs in them.</li>
        <li>Reports you file about other people&rsquo;s content, and the people you block.</li>
      </ul>
      <h3>Notifications</h3>
      <p>
        If you turn on push notifications, your device or browser gives us a
        push token so we can send them. You can switch notifications off in
        the app&rsquo;s Settings at any time.
      </p>
      <h3>Technical information</h3>
      <p>
        Our hosting and database providers automatically log things like IP
        address and request details as part of normal operation (to keep the
        service working and secure). We do not use this to build profiles of
        you, and we do not use advertising identifiers.
      </p>
      <h3>The waitlist on this website</h3>
      <p>
        If you joined the waitlist on playthruu.com, we store the email you
        entered and a rough &ldquo;source&rdquo; tag (which link brought you
        here) to send you launch emails and see which channels work.
      </p>

      <h2>What other people can see</h2>
      <p>
        PlayThruu is a social app and everything on it is public. Your
        profile, username, picture, logged games, ratings, reviews, lists,
        likes and replays can be seen by other users. Messages are visible
        only to the people in that conversation. Do not post anything you
        want to keep private.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To run your account and show your diary, profile and activity.</li>
        <li>To show you what the people you follow have logged.</li>
        <li>To send the notifications you ask for (likes, comments, follows, messages).</li>
        <li>To keep the community safe: handling reports, blocks and abuse.</li>
        <li>To fix problems and improve the app.</li>
      </ul>
      <p>We do not sell your information, and we do not show ads.</p>

      <h2>Who we share it with</h2>
      <p>
        We use a small number of services, each only for its specific job:
      </p>
      <ul>
        <li><strong>Supabase</strong> &mdash; our database, login and file storage. Your account and everything you add is stored here.</li>
        <li><strong>GitHub Pages and Vercel</strong> &mdash; host the app and this website.</li>
        <li><strong>IGDB (Twitch), RAWG, Wikidata and SteamGridDB</strong> &mdash; supply game information and artwork. We look games up with them; they do not receive your account details.</li>
        <li><strong>GIPHY</strong> &mdash; powers the GIF search in messages. What you type into the GIF search is sent to GIPHY.</li>
        <li><strong>Google (Chrome) and your device&rsquo;s push service</strong> &mdash; deliver push notifications to your phone.</li>
        <li><strong>Zoho</strong> &mdash; sends transactional emails such as the waitlist confirmation.</li>
      </ul>
      <p>
        We may also disclose information if the law requires it, or to
        protect people from harm.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your information while your account exists. When you delete
        your account, your profile, logs, reviews, comments, lists, follows
        and messages are removed from our database (see below). Waitlist
        entries are kept until launch or until you ask us to delete yours.
      </p>

      <h2>Deleting your account and your data</h2>
      <p>
        You can delete your account yourself, any time, inside the app:
        open <strong>Settings</strong> and tap <strong>Delete my
        account</strong>. This permanently removes your account and the data
        listed above.
      </p>
      <p>
        If you cannot use the app, email{" "}
        <a href="mailto:hello@playthruu.com">hello@playthruu.com</a> from
        the address on your account and ask us to delete it. We will do it
        promptly, normally within 30 days.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can edit or remove your profile details, reviews, comments and
        lists in the app. You can turn notifications off in Settings. You can
        ask us for a copy of your information or ask us to correct or delete
        it by emailing{" "}
        <a href="mailto:hello@playthruu.com">hello@playthruu.com</a>.
      </p>

      <h2>Security</h2>
      <p>
        Data is sent over encrypted connections (https) and stored with
        access rules so that people can only change their own information. No
        service is perfectly secure, so please use a strong password.
      </p>

      <h2>Children</h2>
      <p>
        PlayThruu is for people aged 13 and over. It is not directed at
        children under 13, and we do not knowingly collect their information.
        If you believe a child under 13 has an account, email us and we will
        remove it.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, we will update the date at the
        top of this page and, for big changes, tell you in the app.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests? Email{" "}
        <a href="mailto:hello@playthruu.com">hello@playthruu.com</a>.
      </p>

    </main>
    <SiteFooter />
    </>
  );
}
