import type { Metadata } from "next";
import Link from "next/link";
import { Building2, GraduationCap, Handshake, ArrowRight, Calendar, Users, DoorOpen } from "lucide-react";
import { Reveal, Stagger, StaggerItem, MotionDiv, GlowOrb } from "@/components/ui/motion";

export const metadata: Metadata = { title: "Service" };

const FEATURED = {
  icon: Building2,
  title: "Rental",
  badge: "NICC SmartSpace",
  desc: "Coworking desks, private meeting rooms, and event halls at our RUPP campus — browse real-time availability and book online through NICC SmartSpace, our digital booking system.",
  points: [
    { icon: Users, label: "Coworking desks" },
    { icon: DoorOpen, label: "Meeting rooms" },
    { icon: Calendar, label: "Event halls" },
  ],
  cta: { label: "Open NICC SmartSpace", href: "/spaces" },
};

const SERVICES = [
  {
    icon: GraduationCap,
    title: "Training",
    desc: "Practical workshops and bootcamps on business planning, digital marketing, and financial literacy.",
    points: ["Hands-on workshops", "Industry-led bootcamps", "Certificates of completion"],
  },
  {
    icon: Handshake,
    title: "Mentoring",
    desc: "One-on-one sessions with experienced entrepreneurs and industry professionals, matched to your business needs.",
    points: ["Matched 1-on-1 mentors", "Ongoing office hours", "Access to our mentor network"],
  },
];

export default function ServicePage() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-white">
        <Reveal className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">Service</span>
          <h1 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">Support that goes beyond funding</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Three ways NICC backs founders — space to work, skills to grow, and
            mentors to guide the way.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <Link
            href={FEATURED.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0a1c38_0%,#16294c_60%,#0a1c38_100%)] p-8 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-900/30 sm:p-12"
          >
            <GlowOrb color="accent" className="-right-16 -top-24 size-80" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <FEATURED.icon className="size-6" />
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-300 backdrop-blur">
                  {FEATURED.badge}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">{FEATURED.title}</h2>
              <p className="mt-3 max-w-2xl text-navy-200">{FEATURED.desc}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {FEATURED.points.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-navy-100"
                  >
                    <Icon className="size-4 text-accent-300" />
                    {label}
                  </span>
                ))}
              </div>

              <span className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg transition-colors group-hover:bg-navy-50">
                {FEATURED.cta.label} <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </Reveal>

        <Stagger className="mt-6 grid gap-6 sm:grid-cols-2" stagger={0.1}>
          {SERVICES.map(({ icon: Icon, title, desc, points }) => (
            <StaggerItem key={title}>
              <MotionDiv
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white py-7 pl-8 pr-7 shadow-sm transition-shadow hover:shadow-lg hover:shadow-navy-900/10"
              >
                <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-navy-500 to-navy-900" />
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-navy-100 text-navy-700 transition-colors group-hover:border-navy-300">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-navy-900">{title}</h2>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {points.map((point) => (
                    <span
                      key={point}
                      className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </MotionDiv>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-white pb-16">
        <Reveal className="mx-auto max-w-4xl rounded-2xl bg-navy-900 px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-bold">Have a question about our services?</h2>
          <p className="mx-auto mt-2 max-w-lg text-navy-200">
            Get in touch with our team or explore our incubation program to see where you fit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/incubation-program" className="rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-600">
              Explore Incubation Program
            </Link>
            <Link href="/about" className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
              About NICC
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
