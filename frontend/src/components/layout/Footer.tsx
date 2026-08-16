import Link from "next/link";
import Image from "next/image";
import { Play, Send } from "lucide-react";
import { Reveal } from "@/components/ui/motion";

const SOCIAL_LINKS: { href: string; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
  { href: "https://www.linkedin.com/company/niccatrupp/", label: "LinkedIn" },
  { href: "https://www.youtube.com/@niccatrupp", label: "YouTube", icon: Play },
  { href: "https://t.me/niccatrupp", label: "Telegram", icon: Send },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy-900 text-navy-100">
      <Reveal className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4" y={16}>
        <div className="md:col-span-1">
          <div className="mb-3 flex items-center gap-2 font-bold text-white">
            <div className="rounded-md bg-white px-2 py-1.5">
              <Image src="/brand/nicc-logo.png" alt="NICC" width={112} height={14} className="h-3.5 w-auto" />
            </div>
          </div>
          <p className="text-sm text-navy-300">
            The National Incubation Center of Cambodia supports founders and
            small businesses with training, mentorship, and workspace — helping
            good ideas grow into resilient companies.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-navy-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {Icon ? <Icon className="size-4" /> : "in"}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-navy-300">
            <li><Link href="/services" prefetch={false} className="hover:text-white">Service</Link></li>
            <li><Link href="/incubation-program" prefetch={false} className="hover:text-white">Incubation Program</Link></li>
            <li><Link href="/events" prefetch={false} className="hover:text-white">Event</Link></li>
            <li><Link href="/ecosystem" prefetch={false} className="hover:text-white">Ecosystem Builder</Link></li>
            <li><Link href="/about" prefetch={false} className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Rental</h4>
          <ul className="space-y-2 text-sm text-navy-300">
            <li><Link href="/spaces" target="_blank" rel="noopener noreferrer" prefetch={false} className="hover:text-white">Browse spaces</Link></li>
            <li><Link href="/pricing" prefetch={false} className="hover:text-white">Pricing</Link></li>
            <li><Link href="/register" prefetch={false} className="hover:text-white">Create an account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Visit us</h4>
          <ul className="space-y-2 text-sm text-navy-300">
            <li>National Incubation Center of Cambodia</li>
            <li>Royal University of Phnom Penh, Phnom Penh</li>
            <li>
              <a href="https://nicc.rupp.edu.kh/" target="_blank" rel="noreferrer noopener" className="hover:text-white">
                nicc.rupp.edu.kh
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
      <div className="border-t border-navy-800 px-4 py-4 text-center text-xs text-navy-400">
        © {new Date().getFullYear()} National Incubation Center of Cambodia (NICC)
      </div>
    </footer>
  );
}
