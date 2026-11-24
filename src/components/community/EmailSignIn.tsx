import { useState, type FormEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function EmailSignIn({
  returnPath = "/members",
}: {
  returnPath?: "/members" | "/prayer";
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(() => {
    const params = new URLSearchParams(
      window.location.hash.slice(1) || window.location.search,
    );
    return params.has("error_description")
      ? "That sign-in link could not be used. Request a new one below."
      : "";
  });

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError("");
    setSent(false);
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}${returnPath}`,
        },
      });
      if (signInError) throw signInError;
      setSent(true);
    } catch {
      setError(
        "We couldn't send the sign-in link. Please wait a moment and try again, or contact the church.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="community-panel">
      <span className="community-icon">
        <Mail size={24} />
      </span>
      <h2 className="mt-5 text-3xl font-semibold text-church-navy-dark">
        Your church, connected.
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Enter your email to receive a secure sign-in link. New members can use
        the same form to create an account.
      </p>
      {!supabase ? (
        <p
          className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
          role="status"
        >
          Member sign-in is temporarily unavailable. Please contact the church.
        </p>
      ) : (
        <form onSubmit={signIn} className="mt-7 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Email address
            <input
              className="community-input mt-2"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSent(false);
              }}
              placeholder="you@example.com"
            />
          </label>
          <button className="community-button w-full" disabled={busy || sent}>
            {busy
              ? "Sending your link…"
              : sent
                ? "Link sent — check your email"
                : "Email me a sign-in link"}
            <ArrowRight size={17} />
          </button>
          {sent && (
            <div
              className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
              role="status"
            >
              Check <strong>{email}</strong>, including your spam folder. Open
              the link to continue. If it expires,{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="font-bold underline"
              >
                request another link
              </button>
              .
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm leading-6 text-red-700">
              {error}
            </p>
          )}
          <p className="text-xs leading-6 text-slate-500">
            Your profile and prayer history are private. Creating a member
            account does not give access to website administration.
          </p>
        </form>
      )}
    </div>
  );
}
