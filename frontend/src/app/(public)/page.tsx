import Link from "next/link";
import Image from "next/image";
import {
  Rocket,
  GraduationCap,
  Building2,
  Handshake,
  Calendar,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  MotionDiv,
  MotionSpan,
  MotionH1,
  MotionP,
} from "@/components/ui/motion";

const FEATURE_STRIP = [
  { icon: Rocket, label: "Incubation" },
  { icon: Handshake, label: "Mentorship" },
  { icon: GraduationCap, label: "Training" },
  { icon: Building2, label: "Workspace" },
];

const STATS = [
  { value: 310, suffix: "K+", label: "Startup Seed Fund" },
  { value: 20, suffix: "+", label: "Partnership" },
  { value: 373, suffix: "+", label: "Mentoring & Consulting" },
  { value: 451, suffix: "+", label: "Event Participants" },
];

const PROGRAMS = [
  {
    icon: Lightbulb,
    title: "Pre-Incubation",
    desc: "Turn an early idea into a validated concept with guided workshops and market research support.",
  },
  {
    icon: Rocket,
    title: "Incubation",
    desc: "A structured multi-month track for founders building their first product and finding early customers.",
  },
  {
    icon: TrendingUp,
    title: "Acceleration",
    desc: "For teams with traction — sharpen your business model and get ready to raise investment.",
  },
  {
    icon: GraduationCap,
    title: "Training & Bootcamps",
    desc: "Short, practical courses on business planning, digital marketing, and financial literacy.",
  },
];

const SERVICES = [
  {
    icon: Building2,
    title: "Rental",
    badge: "NICC SmartSpace",
    desc: "Coworking desks, meeting rooms, and event halls at our RUPP campus — browse and book online.",
    cta: { label: "Book a Space", href: "/spaces" },
  },
  {
    icon: GraduationCap,
    title: "Training",
    badge: "Incubation",
    desc: "Practical workshops, incubation programs, and bootcamps on business planning and digital marketing.",
    cta: { label: "Explore Programs", href: "/incubation-program" },
  },
  {
    icon: Handshake,
    title: "Mentoring",
    badge: "Advisory",
    desc: "One-on-one advisory guidance from experienced entrepreneurs, startup experts, and industry mentors.",
    cta: { label: "Connect with Mentors", href: "/ecosystem" },
  },
];

const EVENTS = [
  { date: "Aug 22, 2026", title: "Founder Office Hours", tag: "Mentorship" },
  { date: "Sep 5, 2026", title: "Startup Bootcamp: Idea to MVP", tag: "Training" },
  { date: "Sep 19, 2026", title: "NICC Demo Day", tag: "Community" },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <Image
          src="/brand/nicc-campus-banner.png"
          alt="NICC campus, Royal University of Phnom Penh"
          fill
          sizes="100vw"
          priority
          className="object-cover object-[center_30%] blur-[3px] scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,28,56,0.94)_0%,rgba(10,28,56,0.9)_55%,rgba(10,28,56,0.96)_100%)]" />

        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <MotionSpan
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-500" />
            </span>
            National Incubation Center of Cambodia · RUPP
          </MotionSpan>

          <MotionH1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl"
          >
            Turning bold ideas into resilient businesses.
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="mx-auto mt-5 max-w-xl text-lg text-navy-100"
          >
            NICC supports Cambodian founders with incubation programs, mentorship,
            and hands-on training — helping good ideas grow into companies that last.
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/incubation-program"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-base font-medium text-navy-900 shadow-sm transition-colors hover:bg-navy-50"
            >
              Explore Programs
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Our Services
              </Button>
            </Link>
          </MotionDiv>

          <Stagger className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-7" stagger={0.08}>
            {FEATURE_STRIP.map(({ icon: Icon, label }) => (
              <StaggerItem key={label} className="flex items-center gap-2 text-sm text-navy-100">
                <Icon className="size-4 text-navy-300" />
                {label}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-navy-50/60 py-12">
        <Stagger className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4" stagger={0.1}>
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                className="text-3xl font-bold text-navy-900 sm:text-4xl"
              />
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Incubation Program</h2>
            <p className="text-gray-500">From first idea to investment-ready — a track for every stage.</p>
          </div>
          <Link href="/incubation-program" className="hidden shrink-0 text-sm font-semibold text-navy-700 hover:underline sm:block">
            View the program →
          </Link>
        </Reveal>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <MotionDiv
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group h-full rounded-2xl border border-gray-100 bg-gradient-to-b from-navy-50/70 to-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-navy-900/5"
              >
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-md shadow-navy-900/20 transition-transform group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-semibold text-navy-900">{title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{desc}</p>
              </MotionDiv>
            </StaggerItem>
          ))}
        </Stagger>
        <Link href="/incubation-program" className="mt-6 flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline sm:hidden">
          View the program <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-navy-900">Service</h2>
            <p className="mt-1 text-gray-500">Support that goes beyond funding.</p>
          </Reveal>
          <Stagger className="grid gap-6 sm:grid-cols-3" stagger={0.1}>
            {SERVICES.map(({ icon: Icon, title, desc, cta, badge }) => {
              const cardClassName =
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white py-6 pl-7 pr-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-navy-900/10 hover:-translate-y-1";
              const content = (
                <>
                  <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-navy-500 to-navy-900" />
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full border-2 border-navy-100 text-navy-700 transition-colors group-hover:border-navy-300">
                      <Icon className="size-5" />
                    </span>
                    {badge && (
                      <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-700">
                        {badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold text-navy-900">{title}</h3>
                  <p className="mt-1.5 flex-grow text-sm text-gray-500">{desc}</p>
                  {cta && (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-navy-800">
                      {cta.label} →
                    </span>
                  )}
                </>
              );

              return (
                <StaggerItem key={title}>
                  <Link href={cta.href} className={cardClassName}>
                    {content}
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal className="mt-8 text-center">
            <Link href="/services" className="text-sm font-semibold text-navy-700 hover:underline">
              See all services →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Upcoming Events</h2>
            <p className="text-gray-500">Workshops, office hours, and community meetups.</p>
          </div>
          <Link href="/events" className="hidden shrink-0 text-sm font-semibold text-navy-700 hover:underline sm:block">
            View all events →
          </Link>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
          {EVENTS.map((event) => (
            <StaggerItem key={event.title}>
              <div className="h-full rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md">
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-600">{event.tag}</span>
                <h3 className="mt-2 font-semibold text-navy-900">{event.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="size-3.5" />
                  {event.date}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t border-gray-100 bg-navy-50/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Ecosystem Builder</h2>
              <p className="text-gray-500">Mentors and startups, in one place.</p>
            </div>
            <Link href="/ecosystem" className="hidden shrink-0 text-sm font-semibold text-navy-700 hover:underline sm:block">
              Explore the ecosystem →
            </Link>
          </Reveal>
          <Stagger className="grid gap-6 sm:grid-cols-2" stagger={0.12}>
            <StaggerItem>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-md shadow-navy-900/20">
                  <Users2 className="size-5" />
                </span>
                <h3 className="font-semibold text-navy-900">Mentor Directory</h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  Browse mentors by industry and expertise, and request a match.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-md shadow-navy-900/20">
                  <Rocket className="size-5" />
                </span>
                <h3 className="font-semibold text-navy-900">Startup Directory</h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  A public showcase of the startups built through NICC&apos;s programs.
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-900">
        <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Have an idea worth building?</h2>
          <p className="max-w-xl text-navy-200">
            Create a free account to apply for a program or get in touch with our team.
          </p>
          <MotionDiv
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2"
          >
            <Link href="/register">
              <Button variant="secondary" size="lg" className="shadow-xl shadow-accent-500/30">
                Get Started
              </Button>
            </Link>
          </MotionDiv>
        </Reveal>
      </section>
    </div>
  );
}
