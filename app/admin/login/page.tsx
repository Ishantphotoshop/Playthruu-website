import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLogin() {
  return (
    <main className="admin-page">
      <h1>PlayThruu admin</h1>
      <p className="admin-muted">
        Sign in with your PlayThruu account. Only accounts listed as news
        admins can use the panel.
      </p>
      <LoginForm />
    </main>
  );
}
