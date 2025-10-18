import Link from "next/link";
import { Tomorrow } from "next/font/google";

export default function HomeLink({ text,href } : { text: string; href: string }) {
    return (
        <Link href={href} className="text-gray-400 bg-gray-800/70 p-2 pl-5 pr-5 rounded-lg hover:text-gray-200 hover:bg-blue-800/70 transition-colors duration-300 ease-in-out">{text}</Link>        
    )
}