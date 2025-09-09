import { BookText, Earth, Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-10 flex items-center justify-center gap-5">
      <Link
        className="flex items-center gap-3 py-2 px-5 rounded-2xl hover:bg-gray-100 duration-200"
        href="https://regenerationcredit.org"
        rel="noopener noreferer"
        target="_blank"
      >
        <Earth />
        Website
      </Link>

      <Link
        className="flex items-center gap-3 py-2 px-5 rounded-2xl hover:bg-gray-100 duration-200"
        href="https://github.com/sintrop/regeneration-credit"
        rel="noopener noreferer"
        target="_blank"
      >
        <Github />
        GitHub
      </Link>

      <Link
        className="flex items-center gap-3 py-2 px-5 rounded-2xl hover:bg-gray-100 duration-200"
        href="https://docs.regenerationcredit.org"
        rel="noopener noreferer"
        target="_blank"
      >
        <BookText />
        Docs
      </Link>
    </footer>
  );
}
