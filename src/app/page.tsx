import { Tektur } from "next/font/google";
import Link from "next/link";
import HomeLink from "./components/homelink";

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400"]
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-5">
      <h1 className={`${tektur.className} flex text-7xl`}>Morse Code</h1>
      <div className="flex gap-5 text-2xl">
          <HomeLink text="Learn" href="/learn"></HomeLink>
          <HomeLink text="Communicate" href="/communicate"></HomeLink>
      </div>
    </div>
  );
}
