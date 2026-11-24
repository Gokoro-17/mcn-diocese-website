import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const memberA = "00000000-0000-4000-8000-000000000001";
const memberB = "00000000-0000-4000-8000-000000000002";
const admin = "00000000-0000-4000-8000-000000000003";

before(async () => {
  // Reproduce Supabase's auth roles and the existing project's prerequisite tables.
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    grant usage on schema auth, public to anon, authenticated;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table public.admins (user_id uuid primary key references auth.users(id));
    alter table public.admins enable row level security;
    grant select on public.admins to authenticated;
    create policy own_admin_record on public.admins for select to authenticated using ((select auth.uid()) = user_id);
    create table public.ministry_profiles (ministry_slug text primary key);
    insert into public.ministry_profiles values ('youth-fellowship');
    insert into auth.users values ('${memberA}'), ('${memberB}'), ('${admin}');
    insert into public.admins values ('${admin}');
  `);
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/20261124080810_add_church_online_portal.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.exec(`
    insert into public.member_profiles (user_id,full_name) values ('${memberA}','Member A'), ('${memberB}','Member B');
    insert into public.prayer_requests (user_id,message) values ('${memberA}','Please pray for my family.'), ('${memberB}','Please pray for guidance.');
  `);
});
after(async () => {
  await db.close();
});

async function asRole(role, userId, work) {
  await db.exec(`begin; set local role ${role};`);
  try {
    await db.query("select set_config('request.jwt.claim.sub', $1, true)", [
      userId ?? "",
    ]);
    return await work();
  } finally {
    await db.exec("rollback");
  }
}

test("new tables all enable RLS and expose no anonymous private data", async () => {
  const result = await db.query(
    "select relrowsecurity from pg_class where oid in ('public.member_profiles'::regclass,'public.prayer_requests'::regclass,'public.live_stream_settings'::regclass)",
  );
  assert.equal(result.rows.length, 3);
  assert.ok(result.rows.every((row) => row.relrowsecurity));
  for (const table of ["member_profiles", "prayer_requests"]) {
    await assert.rejects(
      asRole("anon", null, () => db.query(`select * from public.${table}`)),
      /permission denied/,
    );
  }
  const settings = await asRole("anon", null, () =>
    db.query("select status,watch_url from public.live_stream_settings"),
  );
  assert.deepEqual(settings.rows, [{ status: "offline", watch_url: "" }]);
});

test("members can only read and edit their own profile", async () => {
  await asRole("authenticated", memberA, async () => {
    assert.deepEqual(
      (await db.query("select full_name from member_profiles")).rows,
      [{ full_name: "Member A" }],
    );
    assert.equal(
      (
        await db.query(
          "update member_profiles set full_name='Updated' where user_id=$1 returning user_id",
          [memberA],
        )
      ).rows.length,
      1,
    );
    assert.equal(
      (
        await db.query(
          "update member_profiles set full_name='Attack' where user_id=$1 returning user_id",
          [memberB],
        )
      ).rows.length,
      0,
    );
  });
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query("insert into member_profiles(user_id) values($1)", [admin]),
    ),
    /row-level security/,
  );
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query("update member_profiles set user_id=$1 where user_id=$2", [
        admin,
        memberA,
      ]),
    ),
    /row-level security/,
  );
});

test("prayer history is isolated between members and prayer submission cannot impersonate someone", async () => {
  const requests = await asRole("authenticated", memberA, () =>
    db.query("select user_id from prayer_requests"),
  );
  assert.deepEqual(requests.rows, [{ user_id: memberA }]);
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query(
        "insert into prayer_requests(user_id,message) values ($1,'A forged prayer request')",
        [memberB],
      ),
    ),
    /row-level security/,
  );
  await asRole("authenticated", memberA, async () => {
    await db.query(
      "insert into prayer_requests(user_id,message) values ($1,'Please pray for my studies.')",
      [memberA],
    );
    assert.ok(
      (await db.query("select status from prayer_requests")).rows.every(
        (row) => row.status === "received",
      ),
    );
  });
});

test("members cannot fake prayer statuses, rewrite messages, or insert timestamps", async () => {
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query(
        "insert into prayer_requests(user_id,message,status) values($1,'Please pray for me.','prayed_for')",
        [memberA],
      ),
    ),
    /permission denied/,
  );
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query(
        "insert into prayer_requests(user_id,message,created_at) values($1,'Please pray for me.',now())",
        [memberA],
      ),
    ),
    /permission denied/,
  );
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query("update prayer_requests set message='Changed request'"),
    ),
    /permission denied/,
  );
  const result = await asRole("authenticated", memberA, () =>
    db.query("update prayer_requests set status='prayed_for' returning id"),
  );
  assert.equal(result.rows.length, 0);
});

test("only allowlisted administrators can review requests and update their status", async () => {
  await asRole("authenticated", admin, async () => {
    assert.equal(
      (await db.query("select * from prayer_requests")).rows.length,
      2,
    );
    assert.equal(
      (
        await db.query(
          "update prayer_requests set status='praying' returning id",
        )
      ).rows.length,
      2,
    );
    assert.equal(
      (await db.query("select * from member_profiles")).rows.length,
      0,
    );
  });
  await asRole("authenticated", memberA, async () => {
    await db.query("select set_config('request.jwt.claims', $1, true)", [
      JSON.stringify({ user_metadata: { role: "admin" } }),
    ]);
    assert.equal(
      (
        await db.query(
          "update prayer_requests set status='praying' returning id",
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query(
          "update live_stream_settings set title='Unauthorized' returning id",
        )
      ).rows.length,
      0,
    );
  });
});

test("prayer text limits and categories are enforced by Postgres", async () => {
  for (const message of ["short", " ".repeat(12), "x".repeat(4001)]) {
    await assert.rejects(
      asRole("authenticated", memberA, () =>
        db.query("insert into prayer_requests(user_id,message) values($1,$2)", [
          memberA,
          message,
        ]),
      ),
      /check constraint/,
    );
  }
  await assert.rejects(
    asRole("authenticated", memberA, () =>
      db.query(
        "insert into prayer_requests(user_id,message,category) values($1,'Please pray for me.','Invalid')",
        [memberA],
      ),
    ),
    /check constraint/,
  );
});

test("live settings can be managed only by administrators and cannot claim a live stream without a link", async () => {
  await asRole("authenticated", admin, async () => {
    const result = await db.query(
      "update live_stream_settings set watch_url='https://youtube.com/live/AbCdEf012_-',status='live' returning status",
    );
    assert.equal(result.rows[0].status, "live");
  });
  await assert.rejects(
    asRole("authenticated", admin, () =>
      db.query("update live_stream_settings set status='live'"),
    ),
    /check constraint/,
  );
  await assert.rejects(
    asRole("authenticated", admin, () =>
      db.query(
        "update live_stream_settings set watch_url='https://youtube.com/live/AbCdEf012_-',status='scheduled',scheduled_at=null",
      ),
    ),
    /check constraint/,
  );
  for (const url of [
    "javascript:alert(1)",
    "https://evil.test/live",
    "https://youtube.com.evil.test/live/id",
    "http://youtube.com/live/id",
  ]) {
    await assert.rejects(
      asRole("authenticated", admin, () =>
        db.query("update live_stream_settings set watch_url=$1", [url]),
      ),
      /check constraint/,
    );
  }
});
