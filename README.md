# The Methodist Cathedral of Favour Website

A professional, modern, fully responsive church website built with **React + TypeScript + Vite + Tailwind CSS**.

## 🚀 Getting Started

### Prerequisites
- Node.js v22+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Content Administration

The website includes a private content dashboard at `/admin`. Approved administrators can:

- upload gallery photos and choir/event videos;
- publish sermon video or audio files;
- embed a sermon from YouTube or a public Facebook video;
- add leader profiles and upload their portraits;
- add calendar events for any future date with an optional poster;
- save drafts, publish or unpublish entries, and delete content;
- monitor resumable upload progress for large files.

The public calendar sorts future events automatically and stops showing completed events. When a leader is transferred, unpublish or delete the old profile and add the incoming leader with the correct display order.

## Church online: live worship, prayer, and members

The refresh adds `/live`, `/prayer`, and `/members`, with links in the navigation, homepage, and footer. Headings use Source Serif 4 and body text uses Manrope, with local font fallbacks. Leadership and ministry photos retain their full aspect ratio without cropping or download overlays.

- **Live worship:** administrators use **Admin → Church online → Live stream** to add an official HTTPS YouTube/Facebook link, description, and an offline, scheduled, or live status. Video URLs embed; channel/page URLs open externally. No broadcast or live status is invented. Set status manually at the start and end of a broadcast. Dates are entered and displayed in West Africa Time. The public page refreshes settings every minute.
- **Members:** email magic-link sign-in creates a normal member account. Members can save an optional name, phone, and ministry, read their own latest 100 prayer requests, and open services/events. Member accounts never become administrators automatically. Member profiles are visible only to their owner; there is no public member directory.
- **Prayer:** signed-in members consent to share requests with approved administrators. Requests are private to their owner and administrators. **Admin → Church online → Prayer inbox** filters the latest 100 requests and marks them received, in prayer, or prayed for. Visitors can also open an email to the existing church address. The site confirms submission only after the database accepts it.

### Activate the new features

1. Review and apply `supabase/migrations/20261124080810_add_church_online_portal.sql` to the linked project using your normal migration deployment. This creates `member_profiles`, `prayer_requests`, and `live_stream_settings`, including API grants, length constraints, column permissions, and ownership/admin RLS. It starts with an empty broadcast link and offline status. This local update does not apply hosted migrations or publish the site automatically.
2. In hosted **Authentication → URL Configuration**, set the production Site URL and allow the exact production `/members` and `/prayer` redirect URLs, plus local development URLs if needed. The repository's local Supabase configuration uses port 5173.
3. Enable email authentication and new user signups. Configure a production SMTP sender and verify magic-link delivery; default Supabase email quotas are unsuitable for a congregation. Keep your chosen Auth rate limits and CAPTCHA settings. Never expose secret or service-role keys in the frontend.
4. Keep `public.admins` restricted to approved church administrators. An ordinary member must not be inserted into that table just to use the portal.
5. Add the official streaming link in Admin when it is supplied. Until then, the public live page remains between broadcasts.

`npm test` includes embedded Postgres tests for the actual new migration: anonymous access, cross-member isolation, impersonation attempts, forged status/timestamp inserts, administrator permissions, and broadcast constraints. These do not access the hosted project or send sign-in emails. Finish deployment verification with two separate member accounts, an administrator, a real email sign-in, and the supplied broadcast link.

### Connect Supabase

1. Create a Supabase project.
2. Copy `.env.example` to a new file named `.env.local`.
3. In `.env.local`, replace both placeholder values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Use only the publishable key in this frontend. Never place a secret or service-role key in a `VITE_` variable.

Apply the database and Storage migration:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push --linked
```

The migrations create the `sermons`, `media_items`, `leaders`, `church_events`, and `admins` tables, public media buckets, explicit API grants, and row-level security policies.

### Approve the First Administrator

Create the administrator in **Supabase Dashboard → Authentication → Users**, then run this in the SQL editor with the administrator's real email address:

```sql
insert into public.admins (user_id)
select id from auth.users
where email = 'admin@example.com';
```

The person can then sign in at `/admin`. A normal authenticated user who is not listed in `public.admins` cannot upload, publish, or delete content.

### Build for Production

```bash
pnpm build
# or
npm run build
```

---

## 📁 Project Structure

```
src/
├── assets/
│   └── logoData.ts          # Church logo (base64 embedded)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Top navigation with mobile menu
│   │   └── Footer.tsx        # Site-wide footer
│   ├── sections/             # Homepage sections
│   │   ├── Hero.tsx          # Hero slider + countdown
│   │   ├── WelcomeSection.tsx
│   │   ├── SermonsSection.tsx
│   │   ├── EventsSection.tsx
│   │   ├── MinistriesSection.tsx
│   │   └── InteractiveSections.tsx  # Bible verse + Contact form
│   └── pages/
│       ├── HomePage.tsx      # Assembles all sections
│       ├── AboutPage.tsx
│       ├── LeadershipPage.tsx
│       ├── GalleryPage.tsx
│       └── GivingPage.tsx
├── data/
│   └── churchData.ts         # Static church details and local fallbacks
├── App.tsx                   # Router / page switcher
├── main.tsx                  # Entry point
└── index.css                 # Global styles & animations
```

---

## ✏️ How to Update Content

Sign in at `/admin` to manage content that changes regularly:

- **Sermons** → upload video/audio or add a YouTube or public Facebook video link
- **Events** → add dates, time, venue, description, and an optional poster
- **Leaders** → add a portrait, position, biography, and display order
- **Gallery** → upload church photos and videos

Use **`src/data/churchData.ts`** for less frequently changed details:

- **Bank Accounts** → Edit the `bankAccounts` array
- **Contact Info** → Edit the `contactInfo` object
- **Service Times** → Edit the `serviceTimes` array
- **Weekly Activities** → Edit the `weeklyActivities` array
- **Ministry Profiles** → Edit the `ministries` array to add activity photos and approved president contact details

---

## 🎨 Color Palette (from Logo)

| Color       | Hex       | Usage                    |
|-------------|-----------|--------------------------|
| Church Red  | `#C8102E` | Primary accent, CTAs     |
| Church Navy | `#1B2A6B` | Headers, backgrounds     |
| Church Green| `#2D6A2D` | Ministries, accents      |
| Church Gold | `#B8960C` | Highlights, badges       |

Colors are defined as CSS variables in `src/index.css` and as Tailwind config in `tailwind.config.js`.

---

## 📄 Pages

| Page       | Route (state) | Description                         |
|------------|---------------|-------------------------------------|
| Home       | `home`        | Full homepage with all sections     |
| About      | `about`       | Atamunu congregation, documented local milestones, church life, beliefs |
| Leadership | `leadership`  | Bishop + leadership team            |
| Gallery    | `gallery`     | Filterable photo gallery            |
| Giving     | `giving`      | Bank accounts + giving message      |
| Watch live | `live`        | Broadcast player, upcoming stream, service times |
| Prayer     | `prayer`      | Private prayer submissions and email contact |
| Members    | `members`     | Email sign-in, profile, prayer history, worship/event links |

The About page uses `src/data/localChurchHistory.ts` for its cited local milestones. It distinguishes documented events at 79 Atamunu from the 2022 creation and 2023 inauguration of Atamunu Diocese. No founding date or founding members are asserted for the congregation without parish records. The former national-history timeline and national founders section have been removed from this page.

---

## 🛠 Tech Stack

- **React 19** + TypeScript
- **Vite 8** (build tool)
- **Tailwind CSS 3.4**
- **Radix UI / shadcn-ui** components
- Google Fonts: Source Serif 4 + Manrope
