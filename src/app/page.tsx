import { Tektur } from "next/font/google";
import Link from "next/link";
import HomeLink from "./components/homelink";

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400"]
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-2">
      <h1 className={`${tektur.className} flex text-7xl`}>Morse Code</h1>
      <h2 className="text-lg w-100 text-center text-gray-400 mb-3">
        Learn, practice, and send Morse code in real time with other users.
      </h2>
      <div className="flex gap-5 text-2xl">
        <HomeLink text="Learn" href="/learn"></HomeLink>
        <HomeLink text="Communicate" href="/communicate"></HomeLink>
      </div>
      <div className="fixed bottom-3 text-sm text-gray-500">
        Source on <a className="underline hover:text-gray-200" href="https://github.com/ConstintCreations/Morse-Code" target="_blank">Github</a> | 
        Created with <a className="underline hover:text-gray-200" href="https://react.dev/" target="_blank">React</a>
      </div>
    </div>
  );
}
