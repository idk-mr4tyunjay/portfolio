"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/cn";

/*
  Scene 07 contact form — handwritten aesthetic per 02-VISUAL-DESIGN-SYSTEM.md.
  Submits to /api/contact (Resend).
*/

const ContactSchema = z.object({
  name: z.string().min(1, "name required").max(120),
  email: z.string().email("invalid email"),
  message: z.string().min(1, "say something").max(2000),
});

type ContactValues = z.infer<typeof ContactSchema>;

export function ContactForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to send");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  };

  if (submitted) {
    return (
      <div
        className={cn("text-center text-2xl", className)}
        style={{
          fontFamily: "var(--font-caveat)",
          color: "var(--color-earth-soil)",
        }}
      >
        Signal sent. Looking forward to talking.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("mx-auto w-full max-w-[500px] px-5", className)}
      style={{ fontFamily: "var(--font-caveat)" }}
    >
      <p
        className="mb-6 text-2xl"
        style={{ color: "var(--color-earth-soil)" }}
      >
        What's your next adventure?
      </p>

      <Field
        label="Your name"
        placeholder="First and last"
        error={errors.name?.message}
        {...register("name")}
      />
      <Field
        label="Your email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        as="textarea"
        label="Your message"
        placeholder="Tell me about your next idea…"
        error={errors.message?.message}
        {...register("message")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 border-2 px-6 py-2 text-lg transition-colors hover:bg-[var(--color-earth-soil)] hover:text-[var(--color-peace-white)] disabled:opacity-50"
        style={{
          borderColor: "var(--color-earth-soil)",
          color: "var(--color-earth-soil)",
          fontFamily: "var(--font-caveat)",
        }}
      >
        {isSubmitting ? "Sending…" : "Send Signal"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-700">{error}</p>
      )}
    </form>
  );
}

type FieldProps = (
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
) & {
  label: string;
  error?: string;
  as?: "input" | "textarea";
};

function Field({ label, error, as = "input", ...rest }: FieldProps) {
  const sharedClass =
    "w-full bg-transparent text-base outline-none";
  const baseStyle: React.CSSProperties = {
    color: "var(--color-earth-soil)",
    fontFamily: "var(--font-caveat)",
    borderBottom: "2px solid var(--color-earth-soil)",
    padding: "8px 0",
  };

  return (
    <label className="mb-5 block">
      <span
        className="mb-2 block text-lg"
        style={{ color: "var(--color-earth-soil)" }}
      >
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={cn(sharedClass, "min-h-[80px] resize-y")}
          style={baseStyle}
        />
      ) : (
        <input
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          className={sharedClass}
          style={baseStyle}
        />
      )}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}
