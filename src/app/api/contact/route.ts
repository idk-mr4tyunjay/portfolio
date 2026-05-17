import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

/*
  Scene 07 contact form endpoint.

  Required env vars (see .env.example):
    RESEND_API_KEY     — from https://resend.com
    CONTACT_TO_EMAIL   — destination inbox
    CONTACT_FROM_EMAIL — verified Resend sender (default: onboarding@resend.dev)

  When RESEND_API_KEY is unset we still 200 and log the payload — keeps
  Scene 07 testable locally before email is fully wired.
*/

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.log("[contact] missing RESEND_API_KEY or CONTACT_TO_EMAIL — logging payload", {
      name,
      email,
      message,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New signal from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (result.error) {
      console.error("[contact] resend error", result.error);
      return NextResponse.json(
        { error: "delivery failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return NextResponse.json({ error: "delivery failed" }, { status: 502 });
  }
}
