import { useEffect, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ExternalLink,
  HeartHandshake,
  Radio,
  RefreshCw,
} from "lucide-react";
import {
  churchDate,
  fetchLiveStream,
  fetchPrayers,
  type LiveStream,
  type PrayerRequest,
} from "../../lib/community";
import {
  parseStreamUrl,
  prayerStatuses,
  type PrayerStatus,
} from "../../lib/livestream";
import { supabase } from "../../lib/supabase";

const adminError = (error: unknown) =>
  ["PGRST205", "42P01"].includes((error as { code?: string })?.code ?? "")
    ? "Apply the included church-online database migration before using these controls."
    : "The change could not be completed. Check your connection and administrator access, then try again.";

function StreamSettings() {
  const [stream, setStream] = useState<LiveStream>({
    title: "Worship with us",
    description: "",
    watch_url: "",
    status: "offline",
    scheduled_at: null,
  });
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    void fetchLiveStream()
      .then((value) => {
        if (!active) return;
        if (!value) {
          setError(
            "The live stream settings are missing. Apply the included migration.",
          );
          return;
        }
        setStream(value);
        setError("");
        setTime(
          value.scheduled_at
            ? new Date(Date.parse(value.scheduled_at) + 3_600_000)
                .toISOString()
                .slice(0, 16)
            : "",
        );
      })
      .catch((loadError) => {
        if (active) setError(adminError(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [revision]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase || busy) return;
    setError("");
    setNotice("");
    const source = parseStreamUrl(stream.watch_url);
    if (stream.watch_url.trim() && !source) {
      setError(
        "Use a valid HTTPS YouTube or Facebook video, channel, or page link.",
      );
      return;
    }
    if (stream.status !== "offline" && !source) {
      setError(
        "Add a broadcast link before marking this stream live or scheduled.",
      );
      return;
    }
    if (stream.status === "scheduled" && !time) {
      setError("Choose the broadcast date and time (WAT).");
      return;
    }
    setBusy(true);
    try {
      const { error: saveError } = await supabase
        .from("live_stream_settings")
        .update({
          ...stream,
          title: stream.title.trim(),
          watch_url: source?.watchUrl ?? "",
          scheduled_at: time
            ? new Date(`${time}:00+01:00`).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)
        .select("id")
        .single();
      if (saveError) throw saveError;
      setNotice(
        "Broadcast settings saved. The live page will pick up the change within one minute.",
      );
    } catch (saveError) {
      setError(adminError(saveError));
    } finally {
      setBusy(false);
    }
  }
  const source = parseStreamUrl(stream.watch_url);
  return (
    <form onSubmit={save} className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Live streaming
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Paste the church's official stream link when it is available. YouTube
          videos and public Facebook videos can play on the live page; channel
          and page links open on the original platform.
        </p>
      </div>
      {loading ? (
        <p role="status">Loading broadcast settings…</p>
      ) : (
        <>
          <label className="block text-sm font-semibold text-slate-700">
            Broadcast title
            <input
              className="community-input mt-2"
              maxLength={160}
              required
              value={stream.title}
              onChange={(event) =>
                setStream({ ...stream, title: event.target.value })
              }
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            YouTube or Facebook link
            <input
              className="community-input mt-2"
              type="url"
              maxLength={1000}
              value={stream.watch_url}
              placeholder="Add the official broadcast link"
              onChange={(event) =>
                setStream({ ...stream, watch_url: event.target.value })
              }
            />
          </label>
          {source && (
            <a
              className="inline-flex items-center gap-2 text-sm font-bold text-church-navy"
              href={source.watchUrl}
              target="_blank"
              rel="noreferrer"
            >
              Review link on {source.provider}
              <ExternalLink size={15} />
            </a>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Broadcast status
              <select
                className="community-input mt-2"
                value={stream.status}
                onChange={(event) =>
                  setStream({
                    ...stream,
                    status: event.target.value as LiveStream["status"],
                  })
                }
              >
                <option value="offline">Offline / between broadcasts</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live now</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Broadcast time (WAT)
              <input
                className="community-input mt-2"
                type="datetime-local"
                required={stream.status === "scheduled"}
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Description
            <textarea
              className="community-input mt-2 min-h-28"
              maxLength={1000}
              value={stream.description}
              onChange={(event) =>
                setStream({ ...stream, description: event.target.value })
              }
            />
          </label>
          <p className="rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
            Status is controlled here, not detected from YouTube or Facebook.
            Mark the broadcast live when it starts and offline when it finishes.
          </p>
          <button className="community-button" disabled={busy}>
            <Radio size={16} />
            {busy ? "Saving…" : "Save broadcast settings"}
          </button>
        </>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            onClick={() => setRevision((value) => value + 1)}
            className="ml-3 font-bold underline"
          >
            Reload settings
          </button>
        </p>
      )}
    </form>
  );
}

function PrayerInbox() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [filter, setFilter] = useState<PrayerStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    void fetchPrayers(undefined, filter || undefined)
      .then((value) => {
        if (active) {
          setRequests(value);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setRequests([]);
          setError(adminError(loadError));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filter, revision]);

  async function changeStatus(request: PrayerRequest, status: PrayerStatus) {
    if (!supabase) return;
    setBusy(request.id);
    setError("");
    try {
      const { error: updateError } = await supabase
        .from("prayer_requests")
        .update({ status })
        .eq("id", request.id)
        .select("id")
        .single();
      if (updateError) throw updateError;
      setRevision((value) => value + 1);
    } catch (updateError) {
      setError(adminError(updateError));
    } finally {
      setBusy("");
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Prayer requests
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
            Private requests shared with approved administrators. Status changes
            are visible to the member. Showing the latest 100 requests matching
            your filter.
          </p>
        </div>
        <button
          className="community-button-secondary"
          onClick={() => {
            setLoading(true);
            setRevision((value) => value + 1);
          }}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>
      <label className="mb-6 mt-6 block max-w-xs text-sm font-semibold text-slate-700">
        Filter by status
        <select
          className="community-input mt-2"
          value={filter}
          onChange={(event) => {
            setLoading(true);
            setFilter(event.target.value as PrayerStatus | "");
          }}
        >
          <option value="">All requests</option>
          {Object.entries(prayerStatuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading prayer requests…</p>
      ) : !error && !requests.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          <CheckCircle2 className="mx-auto mb-3" />
          <p>No requests in this view.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-slate-200 p-5 sm:p-6"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {request.name || "Name not provided"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {request.category} · {churchDate(request.created_at)}
                  </p>
                </div>
                <label className="text-xs font-semibold text-slate-500">
                  Request status
                  <select
                    aria-label={`Status for ${request.name || "prayer request"} from ${churchDate(request.created_at)}`}
                    className="community-input mt-1"
                    disabled={busy === request.id}
                    value={request.status}
                    onChange={(event) =>
                      void changeStatus(
                        request,
                        event.target.value as PrayerStatus,
                      )
                    }
                  >
                    {Object.entries(prayerStatuses).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {request.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function OnlineAdmin() {
  const [tab, setTab] = useState("live");
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          className={
            tab === "live" ? "community-button" : "community-button-secondary"
          }
          aria-pressed={tab === "live"}
          onClick={() => setTab("live")}
        >
          <Radio size={17} />
          Live stream
        </button>
        <button
          className={
            tab === "prayer" ? "community-button" : "community-button-secondary"
          }
          aria-pressed={tab === "prayer"}
          onClick={() => setTab("prayer")}
        >
          <HeartHandshake size={17} />
          Prayer inbox
        </button>
      </div>
      {tab === "live" ? <StreamSettings /> : <PrayerInbox />}
    </div>
  );
}
