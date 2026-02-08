"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MeridianLogo } from "@/components/icons";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { id: 1, name: "Features", href: "#features" },
  { id: 2, name: "How It Works", href: "#how-it-works" },
  { id: 3, name: "FAQ", href: "#faq" },
];

export function MarketingNavbar() {
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 10);
    });
    return unsubscribe;
  }, [scrollY]);

  return (
    <header
      className={cn(
        "sticky z-50 flex justify-center transition-all duration-300",
        hasScrolled ? "top-4" : "top-0"
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-5xl rounded-2xl transition-all duration-300",
          hasScrolled
            ? "mx-4 border border-border bg-background/80 px-2 backdrop-blur-lg"
            : "px-6"
        )}
      >
        <div className="flex h-14 items-center justify-between p-4">
          <Link className="flex items-center gap-2.5" href="/">
            <MeridianLogo size={28} />
            <span className="text-lg font-semibold text-primary">Meridian</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                href={link.href}
                key={link.id}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className="hidden h-8 items-center justify-center rounded-full border border-border bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 md:flex"
              href="/chat"
            >
              Try
            </Link>
            <button
              aria-label="Toggle menu"
              className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border md:hidden"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              type="button"
            >
              {isDrawerOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                },
              }}
              className="fixed inset-x-0 bottom-3 mx-auto w-[95%] rounded-xl border border-border bg-background p-4 shadow-lg"
              exit={{ opacity: 0, y: 100, transition: { duration: 0.1 } }}
              initial={{ opacity: 0, y: 100 }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link className="flex items-center gap-2.5" href="/">
                    <MeridianLogo size={28} />
                    <span className="text-lg font-semibold text-primary">
                      Meridian
                    </span>
                  </Link>
                  <button
                    aria-label="Close menu"
                    className="cursor-pointer rounded-md border border-border p-1"
                    onClick={() => setIsDrawerOpen(false)}
                    type="button"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <ul className="flex flex-col rounded-md border border-border text-sm">
                  {NAV_LINKS.map((link) => (
                    <li
                      className="border-b border-border p-2.5 last:border-b-0"
                      key={link.id}
                    >
                      <a
                        className="text-muted-foreground transition-colors hover:text-primary"
                        href={link.href}
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <Link
                  className="flex h-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                  href="/chat"
                >
                  Try
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
