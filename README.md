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
| About      | `about`       | History, founders, beliefs          |
| Leadership | `leadership`  | Bishop + leadership team            |
| Gallery    | `gallery`     | Filterable photo gallery            |
| Giving     | `giving`      | Bank accounts + giving message      |

---

## 🛠 Tech Stack

- **React 19** + TypeScript
- **Vite 8** (build tool)
- **Tailwind CSS 3.4**
- **Radix UI / shadcn-ui** components
- Google Fonts: Playfair Display + Nunito Sans
