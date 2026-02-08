"use client";

import { MeridianLogo } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        hasScrolled ? "top-4" : "top-0",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-5xl rounded-2xl transition-all duration-300",
          hasScrolled
            ? "mx-4 border border-border bg-background/80 px-2 backdrop-blur-lg"
            : "px-6",
        )}
      >
        <div className="flex h-14 items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2.5">
            <MeridianLogo size={28} />
            <span className="text-lg font-semibold text-primary">Meridian</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="hidden h-8 items-center justify-center rounded-full border border-border bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 md:flex"
            >
              Open Chat
            </Link>
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border md:hidden"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              aria-label="Toggle menu"
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-3 mx-auto w-[95%] rounded-xl border border-border bg-background p-4 shadow-lg"
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                },
              }}
              exit={{ opacity: 0, y: 100, transition: { duration: 0.1 } }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2.5">
                    <MeridianLogo size={28} />
                    <span className="text-lg font-semibold text-primary">
                      Meridian
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="cursor-pointer rounded-md border border-border p-1"
                    aria-label="Close menu"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <ul className="flex flex-col rounded-md border border-border text-sm">
                  {NAV_LINKS.map((link) => (
                    <li
                      key={link.id}
                      className="border-b border-border p-2.5 last:border-b-0"
                    >
                      <a
                        href={link.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/chat"
                  className="flex h-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                >
                  Open Chat
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
