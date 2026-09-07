import { useState } from "react";
import { Baby, BookOpen, Check, Church, Copy, Globe2, GraduationCap, HeartHandshake, Info, Landmark, Wheat } from "lucide-react";
import { bankAccounts, contactInfo } from "../../data/churchData";

const givingVerses = [
  { verse: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.", ref: "2 Corinthians 9:7" },
  { verse: "Bring the whole tithe into the storehouse, that there may be food in my house.", ref: "Malachi 3:10" },
  { verse: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.", ref: "Luke 6:38" },
  { verse: "Honor the LORD with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.", ref: "Proverbs 3:9-10" },
];

export default function GivingPage() {
  const [copied, setCopied] = useState<number | null>(null);
  const [verseIdx, setVerseIdx] = useState(0);
  const verifiedBankAccounts = bankAccounts.filter((account) => account.verified);

  const copyAccount = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 md:py-32 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, var(--church-gold) 0%, var(--church-red) 50%, var(--church-navy) 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/5 select-none"
              style={{
                fontSize: `${60 + i * 30}px`,
                top: `${5 + i * 15}%`,
                left: `${i * 18}%`,
              }}
            >
              <Wheat size={60 + i * 30} strokeWidth={1.2} />
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: "rgba(255,255,200,0.9)" }}
          >
            Sow Into God's Kingdom
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-5"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Give & Support
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed text-lg">
            Your generous giving powers the mission of the Methodist Cathedral of Favour by reaching souls, building
            communities, and spreading the love of Christ.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L720 0L1440 60H0Z" fill="var(--church-cream)" />
          </svg>
        </div>
      </section>

      {/* Giving Message */}
      <section className="py-20 md:py-24" style={{ background: "var(--church-cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
            {/* Message */}
            <div>
              <div
                className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
                style={{ color: "var(--church-red)" }}
              >
                Why We Give
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 section-title"
                style={{ color: "var(--church-navy)" }}
              >
                Partner With Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                At the Methodist Cathedral of Favour, every gift makes a difference. Your tithes and offerings support
                the preaching of the Gospel, the planting of new churches, the training of ministers,
                and the care of the vulnerable in our communities.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                We believe giving is an act of worship. It is a tangible expression of your trust in
                God's faithfulness and your partnership in His Kingdom work. When you give to
                the Methodist Cathedral of Favour, you give to God.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Use any of the bank accounts listed below to make your donation. All accounts are
                verified and securely managed by the Cathedral Treasurer&apos;s office.
              </p>

              {/* What giving supports */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: <BookOpen size={21} />, label: "Gospel Outreach" },
                  { icon: <Church size={21} />, label: "Church Building" },
                  { icon: <Baby size={21} />, label: "Children Ministry" },
                  { icon: <GraduationCap size={21} />, label: "Training & Education" },
                  { icon: <HeartHandshake size={21} />, label: "Welfare & Care" },
                  { icon: <Globe2 size={21} />, label: "Missions" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  >
                    <span style={{ color: "var(--church-red)" }}>{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotating Verse */}
            <div
              className="rounded-3xl p-10 text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--church-navy) 0%, var(--church-navy-dark) 100%)",
              }}
            >
              <div
                className="absolute top-0 left-2 text-white/5 select-none pointer-events-none"
                style={{ fontSize: "200px", lineHeight: 1, fontFamily: "Playfair Display, serif" }}
              >
                "
              </div>

              <div className="relative z-10">
                <div
                  className="text-xs uppercase tracking-[0.3em] font-semibold mb-8"
                  style={{ color: "var(--church-gold-light)" }}
                >
                  Scripture on Giving
                </div>

                <p
                  className="text-lg md:text-xl italic font-medium leading-relaxed mb-6"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  "{givingVerses[verseIdx].verse}"
                </p>
                <div
                  className="font-bold text-sm"
                  style={{ color: "var(--church-gold-light)" }}
                >
                  {givingVerses[verseIdx].ref}
                </div>

                <div className="flex gap-2 mt-8">
                  {givingVerses.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVerseIdx(i)}
                      className="w-2 h-2 rounded-full transition-all"
                      aria-label={`Show giving scripture ${i + 1}`}
                      aria-current={i === verseIdx ? "true" : undefined}
                      style={{
                        background: i === verseIdx ? "var(--church-gold-light)" : "rgba(255,255,255,0.25)",
                        transform: i === verseIdx ? "scale(1.4)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bank Accounts */}
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-2 section-title"
              style={{ color: "var(--church-navy)" }}
            >
              Church Bank Accounts
            </h2>
            <p className="text-gray-500 text-sm mb-10 mt-4">
              Only account details confirmed by the Cathedral Treasury office are displayed here.
            </p>

            {verifiedBankAccounts.length > 0 ? (
              <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              {verifiedBankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bank-card bg-white rounded-2xl p-6 relative overflow-hidden group"
                  style={{
                    borderLeft: `4px solid ${account.color}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Top color strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-30"
                    style={{ background: account.color }}
                  />

                  {/* Bank icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 text-white"
                    style={{ background: account.color }}
                  >
                    <Landmark size={23} />
                  </div>

                  <div
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: account.color }}
                  >
                    {account.purpose}
                  </div>

                  <h3
                    className="text-base font-bold mb-4"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}
                  >
                    {account.bankName}
                  </h3>

                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ background: `${account.color}10` }}
                  >
                    <div className="text-xs text-gray-500 mb-1.5 font-medium">Account Name</div>
                    <div className="text-sm font-semibold text-gray-800 leading-tight">{account.accountName}</div>
                  </div>

                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ background: `${account.color}10` }}
                  >
                    <div className="text-xs text-gray-500 mb-1.5 font-medium">Account Number</div>
                    <div
                      className="text-xl font-bold tracking-wider"
                      style={{ fontFamily: "Playfair Display, serif", color: account.color }}
                    >
                      {account.accountNumber}
                    </div>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => copyAccount(
                      account.id,
                      `Bank: ${account.bankName}\nAccount Name: ${account.accountName}\nAccount Number: ${account.accountNumber}`
                    )}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all hover:opacity-90"
                    style={{
                      background: copied === account.id ? "#22C55E" : account.color,
                      color: "white",
                    }}
                  >
                    {copied === account.id ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Account Details</>}
                  </button>
                </div>
              ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <Landmark className="mx-auto mb-4 text-slate-400" size={38} />
                <h3 className="text-lg font-bold" style={{ color: "var(--church-navy)" }}>Account details are being confirmed</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Please contact the Cathedral Treasury office before making a transfer. Verified account details will appear here once approved.</p>
              </div>
            )}
          </div>

          {/* Important Note */}
          <div
            className="mt-12 rounded-2xl p-6 flex items-start gap-4"
            style={{
              background: "rgba(200,16,46,0.06)",
              border: "1.5px solid rgba(200,16,46,0.15)",
            }}
          >
            <Info className="shrink-0" size={24} style={{ color: "var(--church-red)" }} />
            <div>
              <div
                className="font-bold text-sm mb-1"
                style={{ color: "var(--church-red)" }}
              >
                Important Notice
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The Methodist Cathedral of Favour does not process payments through this website. Before making a transfer,
                confirm the account details directly with the Cathedral Treasury office. For receipts or queries, contact
                our treasury office at{" "}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--church-red)" }}
                >
                  {contactInfo.email}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
