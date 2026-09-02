"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { smoothScrollTo } from "@/lib/scroll";

/*
  Command palette, hand-rolled (no deps).
  cmd/ctrl+K toggles. Type to filter, ↑↓ + ↵ to run, esc / backdrop closes.
  Focus moves into the input on open and back to the previous element on close.
*/

interface Action {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
    restoreFocusRef.current?.focus();
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      if (!smoothScrollTo(id)) {
        // Not on this page — go home to the section
        window.location.href = `/#${id}`;
      }
      close();
    },
    [close],
  );

  const actions: Action[] = [
    { id: "work", label: "go to work", hint: "scroll", run: () => scrollTo("index") },
    { id: "projects", label: "go to projects", hint: "scroll", run: () => scrollTo("selected") },
    { id: "contact", label: "go to contact", hint: "scroll", run: () => scrollTo("contact") },
    {
      id: "notes",
      label: "go to notes",
      hint: "/notes",
      run: () => {
        window.location.href = "/notes";
        close();
      },
    },
    {
      id: "github",
      label: "open github",
      hint: "new tab",
      run: () => {
        window.open(SITE.github, "_blank", "noreferrer");
        close();
      },
    },
    {
      id: "linkedin",
      label: "open linkedin",
      hint: "new tab",
      run: () => {
        window.open(SITE.linkedin, "_blank", "noreferrer");
        close();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const clampedSelected = Math.min(selected, Math.max(0, filtered.length - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            restoreFocusRef.current =
              document.activeElement as HTMLElement | null;
          } else {
            restoreFocusRef.current?.focus();
          }
          return !prev;
        });
        setQuery("");
        setSelected(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="palette-backdrop fixed inset-0 z-50 flex items-start justify-center px-6 pt-[18vh]"
      style={{ background: "rgba(0, 0, 0, 0.6)" }}
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-panel w-full max-w-md overflow-hidden rounded-lg"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-hairline)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          aria-label="Search commands"
          placeholder="type a command"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected((s) => Math.min(s + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected((s) => Math.max(s - 1, 0));
            } else if (e.key === "Enter") {
              filtered[clampedSelected]?.run();
            }
          }}
          className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-fg)",
            borderBottom: "1px solid var(--color-hairline)",
          }}
        />
        <ul role="listbox" aria-label="Commands" className="py-1">
          {filtered.length === 0 && (
            <li
              className="px-4 py-2 text-sm"
              style={{ color: "var(--color-fg-muted)" }}
            >
              nothing matches. probably a me problem.
            </li>
          )}
          {filtered.map((action, index) => (
            <li key={action.id} role="option" aria-selected={index === clampedSelected}>
              <button
                type="button"
                onClick={action.run}
                onMouseEnter={() => setSelected(index)}
                className="flex w-full items-baseline justify-between px-4 py-2 text-left text-sm"
                style={{
                  background:
                    index === clampedSelected
                      ? "var(--color-hairline)"
                      : "transparent",
                  color: "var(--color-fg)",
                  transition: "background 0.12s",
                }}
              >
                <span>{action.label}</span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg-muted)",
                  }}
                >
                  {action.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p
          className="px-4 py-2 text-[11px]"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-fg-muted)",
            borderTop: "1px solid var(--color-hairline)",
          }}
        >
          ↑↓ navigate · ↵ select · esc close
        </p>
      </div>
    </div>
  );
}
