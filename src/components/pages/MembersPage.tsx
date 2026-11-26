import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  LogOut,
  Radio,
  UserRound,
} from "lucide-react";
import CommunityIntro from "../community/CommunityIntro";
import EmailSignIn from "../community/EmailSignIn";
import PrayerForm from "../community/PrayerForm";
import { useMemberSession } from "../../context/MemberSession";
import {
  churchDate,
  communityError,
  fetchMemberProfile,
  fetchPrayers,
  saveMemberProfile,
  type MemberProfile,
  type PrayerRequest,
} from "../../lib/community";
import { prayerStatuses } from "../../lib/livestream";
import { supabase } from "../../lib/supabase";
import { ministries } from "../../data/churchData";

function MemberDashboard({
  user,
  onNavigate,
}: {
  user: User;
  onNavigate: (page: string) => void;
}) {
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState<MemberProfile>({
    user_id: user.id,
    full_name: "",
    phone: "",
    ministry_slug: null,
  });
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      fetchMemberProfile(user.id),
      fetchPrayers(user.id),
    ]).then(([profileResult, prayersResult]) => {
      if (!active) return;
      if (profileResult.status === "fulfilled") {
        setProfile(
          profileResult.value ?? {
            user_id: user.id,
            full_name: "",
            phone: "",
            ministry_slug: null,
          },
        );
        setProfileError("");
      } else setProfileError(communityError(profileResult.reason));
      if (prayersResult.status === "fulfilled") {
        setPrayers(prayersResult.value);
        setError("");
      } else setError(communityError(prayersResult.reason));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [user.id, revision]);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setProfileError("");
    setNotice("");
    try {
      await saveMemberProfile({
        ...profile,
        full_name: profile.full_name.trim(),
        phone: profile.phone.trim(),
      });
      setNotice("Your profile has been saved.");
    } catch (saveError) {
      setProfileError(communityError(saveError));
    } finally {
      setSaving(false);
    }
  }
  async function signOut() {
    const { error: signOutError } = await supabase!.auth.signOut({
      scope: "local",
    });
    if (signOutError) setError("We couldn't sign you out. Please try again.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-church-red">
            Your members portal
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-church-navy-dark">
            {profile.full_name
              ? `Welcome, ${profile.full_name}.`
              : "Welcome to your church family."}
          </h2>
          <p className="mt-2 break-all text-base text-slate-500">
            {user.email}
          </p>
        </div>
        <button
          onClick={() => void signOut()}
          className="community-button-secondary"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
      <div
        className="mb-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Member sections"
      >
        {[
          { id: "overview", label: "Overview" },
          { id: "profile", label: "My profile" },
          { id: "prayers", label: "My prayers" },
        ].map((item) => (
          <button
            key={item.id}
            aria-pressed={tab === item.id}
            className={`rounded-full px-5 py-2.5 text-base font-semibold transition ${tab === item.id ? "bg-church-navy-dark text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}
            onClick={() => {
              setTab(item.id);
              setNotice("");
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {(error || profileError) && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-base text-red-700"
        >
          <span>{error || profileError}</span>
          <button
            className="font-bold underline"
            onClick={() => setRevision((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      )}
      {loading ? (
        <div className="community-panel animate-pulse" role="status">
          Loading your portal…
        </div>
      ) : tab === "profile" ? (
        <form
          onSubmit={saveProfile}
          className="community-panel max-w-2xl space-y-5"
        >
          <UserRound className="text-church-navy" size={27} />
          <h3 className="text-3xl font-semibold text-church-navy-dark">
            A little about you
          </h3>
          <p className="text-base leading-7 text-slate-500">
            Your profile is visible only to you. All fields are optional.
          </p>
          <label className="block text-base font-semibold text-slate-700">
            Full name
            <input
              className="community-input mt-2"
              maxLength={120}
              autoComplete="name"
              value={profile.full_name}
              onChange={(event) =>
                setProfile({ ...profile, full_name: event.target.value })
              }
            />
          </label>
          <label className="block text-base font-semibold text-slate-700">
            Phone number
            <input
              className="community-input mt-2"
              type="tel"
              maxLength={40}
              autoComplete="tel"
              value={profile.phone}
              onChange={(event) =>
                setProfile({ ...profile, phone: event.target.value })
              }
            />
          </label>
          <label className="block text-base font-semibold text-slate-700">
            Ministry
            <select
              className="community-input mt-2"
              value={profile.ministry_slug ?? ""}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  ministry_slug: event.target.value || null,
                })
              }
            >
              <option value="">Choose a ministry (optional)</option>
              {ministries.map((ministry) => (
                <option value={ministry.slug} key={ministry.slug}>
                  {ministry.name}
                </option>
              ))}
            </select>
          </label>
          <button className="community-button" disabled={saving}>
            {saving ? "Saving…" : "Save my profile"}
          </button>
          {notice && (
            <p role="status" className="text-base text-emerald-700">
              {notice}
            </p>
          )}
        </form>
      ) : tab === "prayers" ? (
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <PrayerForm
            userId={user.id}
            initialName={profile.full_name}
            onSubmitted={() => setRevision((value) => value + 1)}
          />
          <section className="community-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-semibold text-church-navy-dark">
                My prayer history
              </h3>
              <button
                className="text-sm font-bold text-church-navy underline"
                onClick={() => setRevision((value) => value + 1)}
              >
                Refresh
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Your latest 100 requests. Only you and approved administrators can
              read them.
            </p>
            {error ? (
              <p className="mt-6 text-base text-red-700">
                Prayer history could not be loaded.
              </p>
            ) : prayers.length ? (
              <ul className="mt-6 space-y-5">
                {prayers.map((prayer) => (
                  <li
                    key={prayer.id}
                    className="rounded-2xl border border-slate-100 p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="font-bold text-church-navy">
                        {prayer.category}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-800">
                        {prayerStatuses[prayer.status]}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words text-base leading-7 text-slate-600">
                      {prayer.message}
                    </p>
                    <time
                      className="mt-3 block text-sm text-slate-400"
                      dateTime={prayer.created_at}
                    >
                      {churchDate(prayer.created_at)}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-base leading-7 text-slate-500">
                Your prayer journey starts here. Requests you send will appear
                in this space.
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="community-panel">
            <h3 className="text-3xl font-semibold text-church-navy-dark">
              Faith is better together.
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Stay connected to worship, share a prayer, and find your next
              opportunity for fellowship.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                className="portal-action"
                onClick={() => onNavigate("live")}
              >
                <Radio size={23} />
                <strong>Watch a service</strong>
                <span>Join our online worship</span>
                <ArrowRight size={17} />
              </button>
              <button
                className="portal-action"
                onClick={() => setTab("prayers")}
              >
                <HeartHandshake size={23} />
                <strong>Share a prayer</strong>
                <span>Send a private request</span>
                <ArrowRight size={17} />
              </button>
              <a className="portal-action" href="/#events">
                <CalendarDays size={23} />
                <strong>Church events</strong>
                <span>See what's coming up</span>
                <ArrowRight size={17} />
              </a>
              <a className="portal-action" href="/#visit">
                <CalendarDays size={23} />
                <strong>Service times</strong>
                <span>Plan your next visit</span>
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <aside className="community-panel !bg-[#eaeef7]">
            <UserRound className="text-church-navy" size={25} />
            <h3 className="mt-4 text-2xl font-semibold text-church-navy-dark">
              Make yourself at home.
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Add your name and choose your ministry to personalise your space.
            </p>
            <button
              onClick={() => setTab("profile")}
              className="mt-5 inline-flex items-center gap-2 text-base font-bold text-church-navy"
            >
              Edit my profile
              <ArrowRight size={16} />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function MembersPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const { user, loading, error } = useMemberSession();
  return (
    <>
      <CommunityIntro
        eyebrow="Members portal"
        title="A little closer to your church family."
      >
        <p>
          Your personal space for prayer, fellowship, and staying connected.
        </p>
      </CommunityIntro>
      {loading ? (
        <p className="p-12 text-center" role="status">
          Checking your sign-in…
        </p>
      ) : user ? (
        <MemberDashboard key={user.id} user={user} onNavigate={onNavigate} />
      ) : (
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          <EmailSignIn />
          {error && (
            <p className="mt-4 text-base text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}
