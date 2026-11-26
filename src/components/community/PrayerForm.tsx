import { useState, type FormEvent } from "react";
import { HeartHandshake, LockKeyhole } from "lucide-react";
import { communityError, submitPrayer } from "../../lib/community";
import { prayerCategories } from "../../lib/livestream";

export default function PrayerForm({
  userId,
  initialName = "",
  onSubmitted,
}: {
  userId: string;
  initialName?: string;
  onSubmitted?: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<string>(prayerCategories[0]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent || busy) return;
    setError("");
    setNotice("");
    if (message.trim().length < 10) {
      setError("Please include at least 10 characters in your request.");
      return;
    }
    setBusy(true);
    try {
      await submitPrayer({
        user_id: userId,
        name: name.trim(),
        category,
        message: message.trim(),
      });
      setMessage("");
      setConsent(false);
      setNotice(
        "Your request has been received. You can follow its status in your members portal.",
      );
      onSubmitted?.();
    } catch (submissionError) {
      setError(communityError(submissionError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="community-panel space-y-5">
      <span className="community-icon">
        <HeartHandshake size={25} />
      </span>
      <div>
        <h2 className="text-3xl font-semibold text-church-navy-dark">
          How can we pray with you?
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Share what is on your heart. Your request is visible to you and
          approved church administrators, and will not appear on the public
          website.
        </p>
      </div>
      <label className="block text-base font-semibold text-slate-700">
        Your name <span className="font-normal text-slate-400">(optional)</span>
        <input
          className="community-input mt-2"
          autoComplete="name"
          maxLength={120}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="block text-base font-semibold text-slate-700">
        Prayer focus
        <select
          className="community-input mt-2"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {prayerCategories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block text-base font-semibold text-slate-700">
        Your request
        <textarea
          className="community-input mt-2 min-h-40 resize-y"
          required
          minLength={10}
          maxLength={4000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Please pray with me about…"
        />
        <span className="mt-1 block text-right text-sm font-normal text-slate-400">
          {message.length}/4000
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 accent-church-navy"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        I agree to share this request with approved church administrators for
        prayer and store it in my prayer history.
      </label>
      <button className="community-button" disabled={busy || !consent}>
        <LockKeyhole size={16} />
        {busy ? "Sending request…" : "Send prayer request"}
      </button>
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-base leading-6 text-emerald-800"
        >
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="text-base text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
