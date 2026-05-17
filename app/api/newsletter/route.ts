import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Save to Supabase
    const supabaseAdmin = getSupabaseAdmin();
    const { error: dbError } = await supabaseAdmin
      .from("subscribers")
      .insert([{ email: normalizedEmail }]);

    if (dbError && dbError.code !== "23505") {
      console.error("Newsletter subscription DB error:", dbError);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    // 2. Sync to Brevo
    const apiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_LIST_ID ?? "2", 10);

    if (apiKey) {
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email: normalizedEmail,
          listIds: [listId],
          updateEnabled: true, // update if contact already exists
          attributes: {
            SOURCE: "Trendly Newsletter",
            SUBSCRIBED_AT: new Date().toISOString(),
          },
        }),
      });

      if (!res.ok && res.status !== 204) {
        const err = await res.text();
        // 400 with "Contact already exist" is fine
        if (!err.includes("Contact already exist")) {
          console.error("Brevo sync error:", err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
