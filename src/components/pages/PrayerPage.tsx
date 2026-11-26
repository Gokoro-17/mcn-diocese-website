import { HeartHandshake, Mail, ShieldCheck } from "lucide-react";
import CommunityIntro from "../community/CommunityIntro";
import EmailSignIn from "../community/EmailSignIn";
import PrayerForm from "../community/PrayerForm";
import { useMemberSession } from "../../context/MemberSession";
import { contactInfo } from "../../data/churchData";

export default function PrayerPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const { user, loading, error } = useMemberSession();
  return (
    <>
      <CommunityIntro
        eyebrow="Prayer & care"
        title="You do not have to carry it alone."
      >
        <p>
          In seasons of joy, uncertainty, or need, let us bring your concerns
          before God together.
        </p>
      </CommunityIntro>
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:py-16">
        <div>
          {loading ? (
            <div className="community-panel animate-pulse" role="status">
              Checking your sign-in…
            </div>
          ) : user ? (
            <PrayerForm key={user.id} userId={user.id} />
          ) : (
            <>
              <p className="mb-5 text-base leading-7 text-slate-600">
                Sign in to send a private prayer request and follow it in your
                members portal.
              </p>
              <EmailSignIn returnPath="/prayer" />
            </>
          )}
          {error && (
            <p className="mt-4 text-base text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
        <aside className="space-y-7 lg:pt-5">
          <ShieldCheck
            className="text-church-navy"
            size={28}
            strokeWidth={1.4}
          />
          <h2 className="text-2xl font-semibold text-church-navy-dark">
            Shared with care.
          </h2>
          <p className="text-base leading-7 text-slate-600">
            Requests submitted here are private to you and approved church
            administrators. Share only the details you feel comfortable
            providing.
          </p>
          <div className="border-t border-slate-200 pt-6">
            <HeartHandshake className="mb-3 text-church-red" size={23} />
            <h3 className="text-lg font-semibold text-church-navy-dark">
              Your prayer journey
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-600">
              See your previous requests and updates from the church in one
              place.
            </p>
            <button
              className="mt-3 text-base font-bold text-church-navy underline underline-offset-4"
              onClick={() => onNavigate("members")}
            >
              Open members portal
            </button>
          </div>
          <a
            href={`mailto:${contactInfo.email}?subject=Prayer%20request`}
            className="inline-flex items-center gap-2 text-base font-semibold text-church-navy"
          >
            <Mail size={17} />
            Prefer email? Contact the church
          </a>
        </aside>
      </div>
    </>
  );
}
