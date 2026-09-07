import { Cross, UserRound } from "lucide-react";
import mcnLogo from "../../assets/mcn-logo.jpg";
import johnWesleyPortrait from "../../assets/history/john-wesley.jpg";
import charlesWesleyPortrait from "../../assets/history/charles-wesley.jpg";
import thomasBirchFreemanPortrait from "../../assets/history/thomas-birch-freeman.png";
import { methodistHistory } from "../../data/churchData";

const founders = [
  {
    name: "Rev. John Wesley",
    role: "Founder of Methodism",
    period: "1703 to 1791",
    description:
      "John Wesley was an English cleric and theologian who, with his brother Charles Wesley, founded the Methodist movement. His emphasis on personal holiness, grace, and social justice laid the foundation for one of Christianity's great branches.",
    color: "var(--church-navy)",
    image: johnWesleyPortrait,
  },
  {
    name: "Charles Wesley",
    role: "Cofounder and Hymn Writer",
    period: "1707 to 1788",
    description:
      "Charles Wesley was a prolific hymn writer who penned over 6,000 hymns, including beloved classics like 'O for a Thousand Tongues to Sing.' His lyrical genius gave Methodism its distinctive musical voice.",
    color: "var(--church-red)",
    image: charlesWesleyPortrait,
  },
  {
    name: "Rev. Thomas Birch Freeman",
    role: "Pioneer in Nigeria",
    period: "1809 to 1890",
    description:
      "The Rev. Thomas Birch Freeman was a Methodist missionary of British and Ghanaian heritage who brought the Methodist faith to Nigeria in 1842. His arrival in Badagry marked the beginning of a rich spiritual heritage that now reaches millions across Nigeria.",
    color: "var(--church-green)",
    image: thomasBirchFreemanPortrait,
  },
];

const milestones = [
  { year: "1739", event: "John Wesley begins the Methodist movement in England" },
  { year: "1842", event: "Rev. T.B. Freeman arrives in Badagry, Nigeria" },
  { year: "1844", event: "Methodist Church formally established in Nigeria" },
  { year: "1962", event: "Methodist Church Nigeria gains full autonomy" },
  { year: "Today", event: "The Methodist Cathedral of Favour continues its mission of worship, discipleship, and service" },
];

const beliefs = [
  { title: "Scripture", text: "The Holy Bible is the inspired Word of God, the ultimate rule for faith and practice." },
  { title: "Grace", text: "We believe in prevenient, justifying, and sanctifying grace, which is God's unmerited love reaching every soul." },
  { title: "Holiness", text: "We are called to scriptural holiness, a life transformed by love of God and neighbour." },
  { title: "Sacraments", text: "Baptism and the Lord's Supper are sacred means of grace ordained by Christ." },
  { title: "Community", text: "The church is the body of Christ, called to worship, nurture, service, and witness together." },
  { title: "Mission", text: "We are called to proclaim the Gospel to every person and transform every community." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 md:py-32 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--church-navy-dark) 0%, var(--church-navy) 50%, var(--church-red) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white"
              style={{ top: `${15 + i * 15}%`, left: `${i * 18}%`, opacity: 0.08 }}
            ><Cross size={96} strokeWidth={1.2} /></div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-8 shadow-2xl"
            style={{ border: "3px solid rgba(255,255,255,0.3)" }}>
            <img src={mcnLogo} alt="MCN Logo" className="w-full h-full object-cover" />
          </div>
          <div
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: "var(--church-gold-light)" }}
          >
            Our Heritage & Story
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-5"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            About Us
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
            Discover the rich heritage, enduring faith, and transforming mission of the Methodist Cathedral of Favour.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L720 0L1440 60H0Z" fill="var(--church-cream)" />
          </svg>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 md:py-28" style={{ background: "var(--church-cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
                style={{ color: "var(--church-red)" }}
              >
                Since {methodistHistory.founding}
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 section-title"
                style={{ color: "var(--church-navy)" }}
              >
                Our History
              </h2>
              {methodistHistory.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {para}
                </p>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative pl-6">
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5"
                style={{ background: "var(--church-red)" }}
              />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <div key={i} className="relative pl-8">
                    <div
                      className="absolute left-0 w-5 h-5 rounded-full -translate-x-2.5 flex items-center justify-center"
                      style={{ background: "var(--church-red)", top: "2px" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--church-red)" }}
                    >
                      {m.year}
                    </div>
                    <p className="text-sm text-gray-700">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 md:py-24" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
              style={{ color: "var(--church-red)" }}
            >
              Standing on Their Shoulders
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold section-title centered"
              style={{ color: "var(--church-navy)" }}
            >
              Our Founders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden card-hover"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
              >
                {/* Founder portrait */}
                <div
                  className="flex aspect-[4/5] items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${f.color} 0%, ${f.color}99 100%)`,
                  }}
                >
                  {f.image ? (
                    <img src={f.image} alt={`${f.name} portrait`} className="h-full w-full object-cover object-top" loading="lazy" />
                  ) : (
                    <div className="text-center text-white/90">
                      <UserRound className="mx-auto mb-3" size={52} strokeWidth={1.4} />
                      <div className="text-lg font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
                        {f.name.split(" ").slice(-1)[0]}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: f.color }}
                  >
                    {f.period}
                  </div>
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}
                  >
                    {f.name}
                  </h3>
                  <div className="text-xs font-semibold text-gray-400 mb-3">{f.role}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section
        className="py-20 md:py-24"
        style={{ background: "var(--church-cream)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
              style={{ color: "var(--church-red)" }}
            >
              Our Doctrinal Foundation
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold section-title centered"
              style={{ color: "var(--church-navy)" }}
            >
              What We Believe
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 card-hover"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: "rgba(200,16,46,0.1)" }}
                >
                  <Cross size={22} style={{ color: "var(--church-red)" }} />
                </div>
                <h4
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}
                >
                  {b.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
