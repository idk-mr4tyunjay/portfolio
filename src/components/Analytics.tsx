/*
  Umami tracking snippet. Server component — renders the self-hosted Umami
  script only when both env vars are set, so local dev and unconfigured builds
  stay silent. Values are public (they ship in the HTML) and inlined at build
  via NEXT_PUBLIC_*; see Dockerfile build args and the deploy workflow.
*/

const SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_URL;
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export function Analytics() {
  if (!SCRIPT_URL || !WEBSITE_ID) return null;

  return <script defer src={SCRIPT_URL} data-website-id={WEBSITE_ID} />;
}
