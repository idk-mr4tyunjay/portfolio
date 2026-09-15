/*
  The Warli figure — SPEC.md §2, §4.5. One stick figure in the same line
  weight as the tree, sitting with a cup while three flames burn beside it.
  The flames flicker only while hovered (CSS). Caption is real text under it.
*/

export function Warli() {
  return (
    <figure className="warli m-0 grid w-[200px] gap-2 justify-self-end" tabIndex={0} aria-label="A figure sitting calmly with a cup next to three small flames. Caption: this is fine.">
      <svg viewBox="0 0 200 120" width="200" height="120" aria-hidden>
        {/* ground */}
        <line x1="8" y1="110" x2="192" y2="110" />
        {/* head */}
        <circle cx="52" cy="46" r="8" />
        {/* torso and hips: two triangles meeting at the waist */}
        <path d="M40 56 L64 56 L52 80 Z" />
        <path d="M52 80 L36 100 L68 100 Z" />
        {/* legs, sitting */}
        <path d="M40 100 L24 104 L24 110" />
        <path d="M64 100 L80 104 L80 110" />
        {/* left arm resting */}
        <path d="M43 60 L30 78" />
        {/* right arm, holding the cup */}
        <path d="M61 60 L78 70 L86 66" />
        <path d="M84 58 h12 v10 h-12 z" />
        <path d="M96 60 q6 3 0 6" />
        {/* flames: three frames, one visible at a time */}
        <g className="flame">
          <path d="M132 110 C122 96 128 86 134 76 C138 86 144 96 132 110 Z" />
          <path d="M156 110 C146 98 150 86 158 72 C164 86 168 98 156 110 Z" />
          <path d="M180 110 C172 100 174 90 182 80 C186 90 190 100 180 110 Z" />
        </g>
        <g className="flame">
          <path d="M132 110 C124 98 126 88 130 80 C138 88 142 98 132 110 Z" />
          <path d="M156 110 C148 96 154 84 154 68 C166 84 166 98 156 110 Z" />
          <path d="M180 110 C170 98 176 90 178 78 C188 90 188 100 180 110 Z" />
        </g>
        <g className="flame">
          <path d="M132 110 C120 96 130 88 136 74 C138 88 146 98 132 110 Z" />
          <path d="M156 110 C144 100 152 88 160 76 C162 90 170 100 156 110 Z" />
          <path d="M180 110 C174 102 172 92 184 84 C184 94 192 102 180 110 Z" />
        </g>
      </svg>
      <figcaption className="t-meta">this is fine.</figcaption>
    </figure>
  );
}
