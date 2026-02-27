"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clio-blue text-white">
            <Scale className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight text-clio-navy">
              Clio Harmonize
            </span>
            {/* <span className="text-xs text-muted-foreground">
              Harmonize Colorado Statutes
            </span> */}
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground transition-colors hover:text-clio-blue"
          >
            Home
          </Link>
          <Link
            href="/bills"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-clio-blue"
          >
            Bills
          </Link>
        </nav>
      </div>
    </header>
  );
}
