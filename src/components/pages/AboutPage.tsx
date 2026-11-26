import CommunityIntro from "../community/CommunityIntro";
import {
  BookOpen,
  Cross,
  HeartHandshake,
  MapPin,
  UsersRound,
} from "lucide-react";

import {
  CHURCH_MISSION,
  CHURCH_VISION,
  CHURCH_NAME,
  contactInfo,
} from "../../data/churchData";
import {
  localChurchMilestones,
  localHistorySources,
} from "../../data/localChurchHistory";

const churchLife = [
  {
    title: "Worship and prayer",
    text: "Sunday worship, Holy Communion, Bible study, prayer, and the ministry of our choirs bring our church family together around the Word of God.",
    Icon: BookOpen,
  },
  {
    title: "Growing together",
    text: "Our children's ministry, youth fellowship, and fellowships for women and men provide places to learn, build friendships, and take part in church life.",
    Icon: UsersRound,
  },
  {
    title: "Faith expressed in service",
    text: "We seek to live out our faith through evangelism, compassionate care, and service to the people around us in Calabar.",
    Icon: HeartHandshake,
  },
];

const beliefs = [
  {
    title: "Scripture",
    text: "The Holy Bible is the inspired Word of God, the ultimate rule for faith and practice.",
  },
  {
    title: "Grace",
    text: "We believe in prevenient, justifying, and sanctifying grace, which is God's unmerited love reaching every soul.",
  },
  {
    title: "Holiness",
    text: "We are called to scriptural holiness, a life transformed by love of God and neighbour.",
  },
  {
    title: "Sacraments",
    text: "Baptism and the Lord's Supper are sacred means of grace ordained by Christ.",
  },
  {
    title: "Community",
    text: "The church is the body of Christ, called to worship, nurture, service, and witness together.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <CommunityIntro
        eyebrow="Our church in Calabar"
        title="Our story at Atamunu"
      >
        <p>{CHURCH_NAME} at 79 Atamunu Street, Calabar, Cross River State.</p>
      </CommunityIntro>

      <section className="py-16 md:py-24" aria-labelledby="local-history-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-church-red">
                Rooted in this community
              </p>
              <h2
                id="local-history-title"
                className="section-title mb-7 text-3xl font-semibold md:text-4xl"
              >
                The congregation behind the cathedral
              </h2>
              <div className="space-y-5 text-base leading-8 text-slate-600">
                <p>
                  Our home is 79 Atamunu Street in Calabar. Here, our
                  congregation gathers for worship, prayer, Holy Communion,
                  fellowship, and the teaching of God's Word as part of
                  Methodist Church Nigeria.
                </p>
                <p>
                  The local congregation's story predates the creation of
                  Atamunu Diocese. In his remembrance of Archbishop Efiom E.
                  Ekpenyong, Methodist minister Deji Okegbile recalls the
                  archbishop's ministry at AGLOW 2015 at Methodist Church
                  Nigeria, 79 Atamunu Street. His account records a worshipping
                  church at this address years before the diocesan inauguration.{" "}
                  <a
                    href={localHistorySources.aglow.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-church-navy underline underline-offset-4"
                  >
                    Read the recollection
                  </a>
                  .
                </p>
                <p>
                  A later chapter began in August 2022 with the creation of
                  Atamunu Diocese from Calabar Diocese. Its inauguration on 7
                  May 2023 brought the congregation into a new diocesan chapter
                  at the Cathedral of Favour. Those events belong to the history
                  of the diocese; they do not establish the founding date of the
                  local church.{" "}
                  <a
                    href={localHistorySources.diocese.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-church-navy underline underline-offset-4"
                  >
                    Read the inauguration account
                  </a>
                  .
                </p>
                <p>
                  Our life together continues through worship, discipleship, the
                  ministries of children and young people, fellowship, and
                  service.
                </p>
              </div>
              <aside
                className="mt-7 rounded-2xl border border-[#e6e1d6] bg-white p-5 text-sm leading-7 text-slate-500"
                aria-label="Historical record note"
              >
                <strong className="block text-base font-semibold text-church-navy">
                  Our earliest years
                </strong>
                The public sources cited here do not establish the
                congregation's original founding date or name its first members.
                Those details require confirmation from local church records.
                The timeline records documented events, rather than a founding
                year.
              </aside>
              <a
                href={contactInfo.maps}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-church-navy"
              >
                <MapPin size={18} />
                Find us at 79 Atamunu Street
              </a>
            </div>
            <div className="community-panel">
              <h3 className="mb-7 text-2xl font-semibold text-church-navy-dark">
                Chapters in our local story
              </h3>
              <ol className="space-y-7 border-l border-[#d6dcec] pl-6">
                {localChurchMilestones.map((milestone) => (
                  <li key={milestone.date} className="relative">
                    <span className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full bg-church-red ring-4 ring-white" />
                    <p className="text-sm font-bold uppercase tracking-wider text-church-red">
                      {milestone.date}
                    </p>
                    <h4 className="mb-2 mt-2 text-lg font-semibold text-church-navy-dark">
                      {milestone.title}
                    </h4>
                    <p className="text-base leading-7 text-slate-600">
                      {milestone.description}
                    </p>
                    <a
                      href={localHistorySources[milestone.source].url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-church-navy underline underline-offset-4"
                      aria-label={`Source for ${milestone.title}`}
                    >
                      Source
                    </a>
                  </li>
                ))}
              </ol>
              <details className="mt-8 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-500">
                <summary className="cursor-pointer font-semibold text-church-navy">
                  History sources
                </summary>
                <ul className="mt-3 space-y-3">
                  {Object.entries(localHistorySources).map(([key, source]) => (
                    <li key={key}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white py-16 md:py-24"
        aria-labelledby="local-church-life"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-church-red">
            Faith lived together
          </p>
          <h2
            id="local-church-life"
            className="section-title mb-10 text-3xl font-semibold md:text-4xl"
          >
            Life at the Cathedral of Favour
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {churchLife.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-100 p-7"
              >
                <span className="community-icon">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <h3 className="mb-3 mt-5 text-2xl font-semibold text-church-navy-dark">
                  {title}
                </h3>
                <p className="text-base leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="site-section border-y border-slate-200/80"
        aria-label="Our purpose"
      >
        <div className="site-container grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="section-heading mb-5">Our mission</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              {CHURCH_MISSION}
            </p>
          </div>
          <div>
            <h2 className="section-heading mb-5">Our vision</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              {CHURCH_VISION}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="church-beliefs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-red">
              The faith we share
            </p>
            <h2
              id="church-beliefs"
              className="section-title centered text-3xl font-semibold md:text-4xl"
            >
              What we believe
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beliefs.map((belief) => (
              <article
                key={belief.title}
                className="card-hover rounded-2xl bg-white p-7 shadow-sm"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-church-red">
                  <Cross size={22} />
                </span>
                <h3 className="mb-2 text-lg font-semibold text-church-navy">
                  {belief.title}
                </h3>
                <p className="text-base leading-7 text-slate-600">
                  {belief.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
