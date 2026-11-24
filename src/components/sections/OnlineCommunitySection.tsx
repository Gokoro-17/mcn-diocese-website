import { ArrowUpRight, HeartHandshake, Radio, UsersRound } from "lucide-react";

const links = [
  {
    page: "live",
    label: "Worship wherever you are.",
    eyebrow: "Watch live",
    detail: "Join our next broadcast and worship with your church family.",
    Icon: Radio,
    color: "bg-[#eaeef7] text-church-navy",
  },
  {
    page: "prayer",
    label: "Let us pray with you.",
    eyebrow: "Prayer & care",
    detail: "Share a private request. You don't have to carry it alone.",
    Icon: HeartHandshake,
    color: "bg-[#f9ede8] text-church-red-dark",
  },
  {
    page: "members",
    label: "A space to call your own.",
    eyebrow: "Members portal",
    detail: "Your profile, prayer journey, and church life in one place.",
    Icon: UsersRound,
    color: "bg-[#edf1e7] text-church-green",
  },
];

export default function OnlineCommunitySection({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <section
      className="border-b border-[#e9e4d9] py-14 md:py-20"
      aria-labelledby="church-online-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-church-red">
              Church beyond Sunday
            </p>
            <h2
              id="church-online-title"
              className="text-3xl font-semibold text-church-navy-dark md:text-4xl"
            >
              Keep faith close.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-500">
            A few more ways to worship, find support, and belong throughout the
            week.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {links.map(({ page, label, eyebrow, detail, Icon, color }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="online-card group"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon size={23} strokeWidth={1.5} />
                </span>
                <ArrowUpRight
                  size={22}
                  className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-church-navy"
                />
              </div>
              <p className="mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {eyebrow}
              </p>
              <h3 className="text-2xl font-semibold leading-tight text-church-navy-dark">
                {label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{detail}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
