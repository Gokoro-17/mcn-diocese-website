import { supabase } from "./supabase";
import type { PrayerStatus } from "./livestream";

export interface MemberProfile {
  user_id: string;
  full_name: string;
  phone: string;
  ministry_slug: string | null;
}

export interface PrayerRequest {
  id: string;
  user_id: string;
  name: string;
  category: string;
  message: string;
  status: PrayerStatus;
  created_at: string;
}

export interface LiveStream {
  title: string;
  description: string;
  watch_url: string;
  status: "offline" | "scheduled" | "live";
  scheduled_at: string | null;
}

export function communityError(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (["PGRST205", "42P01"].includes(code ?? ""))
    return "This service is being prepared. Please try again later or contact the church.";
  return "We couldn't complete that request. Please check your connection and try again.";
}

function client() {
  if (!supabase)
    throw new Error("Online services are temporarily unavailable.");
  return supabase;
}

export async function fetchLiveStream(): Promise<LiveStream | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("live_stream_settings")
    .select("title,description,watch_url,status,scheduled_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMemberProfile(
  userId: string,
): Promise<MemberProfile | null> {
  const { data, error } = await client()
    .from("member_profiles")
    .select("user_id,full_name,phone,ministry_slug")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveMemberProfile(profile: MemberProfile) {
  const { error } = await client()
    .from("member_profiles")
    .upsert(
      { ...profile, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  if (error) throw error;
}

export async function fetchPrayers(
  userId?: string,
  status?: PrayerStatus,
): Promise<PrayerRequest[]> {
  let query = client()
    .from("prayer_requests")
    .select("id,user_id,name,category,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (userId) query = query.eq("user_id", userId);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function submitPrayer(
  prayer: Pick<PrayerRequest, "user_id" | "name" | "category" | "message">,
) {
  const { error } = await client().from("prayer_requests").insert(prayer);
  if (error) throw error;
}

export const churchDate = (value: string) =>
  new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
