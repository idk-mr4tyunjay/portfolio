import Link from "next/link";
import { Nav } from "@/components/home/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="gutter flex min-h-[80vh] flex-col justify-end pb-16">
        <h1 className="t-title m-0">404</h1>
        <p className="mt-6 max-w-[40ch] text-[18px] leading-[1.45]">
          Nothing at this address. If a link brought you here, tell me and I will fix it.
        </p>
        <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-6 p-0 text-[15px]">
          <li>
            <Link href="/" className="link" data-cursor="open">
              home
            </Link>
          </li>
          <li>
            <Link href="/notes" className="link" data-cursor="open">
              notes
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}
