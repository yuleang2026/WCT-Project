import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Rocket, Users2, Building2, Target, Eye } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  "Founder-first, always",
  "Practical over theoretical",
  "Open to every sector and background",
  "Building a lasting local ecosystem",
];

const WHAT_WE_DO = [
  { icon: Rocket, title: "Incubation & Training", desc: "Structured programs and workshops for founders at every stage, from first idea to first customers." },
  { icon: Users2, title: "Mentoring & Advisory", desc: "Direct connections to experienced mentors and advisors across Cambodia's startup ecosystem." },
  { icon: Building2, title: "Workspace", desc: "Coworking desks, meeting rooms, and event halls for founders and the wider community." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">About NICC</span>
        <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
          National Incubation Center of Cambodia
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Based at the Royal University of Phnom Penh, NICC supports Cambodian
          entrepreneurs through incubation, mentorship, and hands-on training —
          giving founders the tools, network, and workspace they need to turn
          an idea into a business that lasts.
        </p>
      </Reveal>

      <Stagger className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.12}>
        <StaggerItem className="rounded-xl border border-gray-200 p-6">
          <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
            <Target className="size-4.5" />
          </span>
          <h2 className="font-semibold text-navy-900">Our Mission</h2>
          <p className="mt-2 text-sm text-gray-600">
            To equip Cambodian founders with the skills, mentorship, and resources
            they need to build viable, resilient businesses.
          </p>
        </StaggerItem>
        <StaggerItem className="rounded-xl border border-gray-200 p-6">
          <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
            <Eye className="size-4.5" />
          </span>
          <h2 className="font-semibold text-navy-900">Our Vision</h2>
          <p className="mt-2 text-sm text-gray-600">
            A thriving, self-sustaining entrepreneurship ecosystem in Cambodia,
            led by founders equipped to compete regionally and beyond.
          </p>
        </StaggerItem>
      </Stagger>

      <Reveal delay={0.08} className="mt-10">
        <h2 className="mb-4 font-semibold text-navy-900">What we do</h2>
        <Stagger className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
          {WHAT_WE_DO.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title} className="rounded-xl border border-gray-200 p-5">
              <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <Icon className="size-4.5" />
              </span>
              <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-navy-900">What we value</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {VALUES.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="size-4 shrink-0 text-navy-600" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 rounded-xl bg-navy-900 p-8 text-white">
        <h2 className="text-xl font-semibold">Where to find us</h2>
        <p className="mt-2 text-navy-200">
          National Incubation Center of Cambodia, Royal University of Phnom Penh.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <a href="https://nicc.rupp.edu.kh/" target="_blank" rel="noreferrer noopener" className="inline-block text-accent-300 hover:underline">
            nicc.rupp.edu.kh
          </a>
          <Link href="/incubation-program" className="inline-block text-accent-300 hover:underline">
            Explore our programs →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
