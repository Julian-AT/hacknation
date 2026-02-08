import { MeridianLogo } from "@/components/icons";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Chat", href: "/chat" },
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Virtue Foundation", href: "https://virtuefoundation.org" },
      { label: "Ghana Health Service", href: "https://ghs.gov.gh" },
      { label: "WHO Africa", href: "https://www.afro.who.int" },
    ],
  },
];

export function FooterSection() {
  return (
    <footer className="w-full border-t border-border py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex max-w-xs flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <MeridianLogo size={24} />
              <span className="text-lg font-semibold text-primary">
                Meridian
              </span>
            </Link>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              AI-powered healthcare facility analysis and mapping for Ghana.
              Built for the Virtue Foundation.
            </p>
          </div>

          <div className="flex gap-16">
            {FOOTER_LINKS.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-primary">
                  {column.title}
                </span>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Meridian. Built for the Virtue
            Foundation Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}
