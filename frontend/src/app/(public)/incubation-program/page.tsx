import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, Rocket, TrendingUp, GraduationCap, ArrowRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = { title: "Incubation Program" };

const PROGRAMS = [
  {
    icon: Lightbulb,
    title: "Pre-Incubation",
    duration: "4 weeks",
    audience: "Aspiring founders",
    desc: "For founders with an early idea. Guided workshops on problem validation, customer discovery, and building a first prototype.",
    outcomes: ["Validated problem statement", "Basic prototype or landing page", "Pitch-ready idea deck"],
  },
  {
    icon: Rocket,
    title: "Incubation",
    duration: "3–6 months",
    audience: "Early-stage startups",
    desc: "A structured track for teams building their first product. Combines curriculum, mentorship, and access to workspace.",
    outcomes: ["Working MVP", "First paying customers", "Assigned mentor"],
  },
  {
    icon: TrendingUp,
    title: "Acceleration",
    duration: "3 months",
    audience: "Startups with traction",
    desc: "For teams with early revenue or users, focused on scaling operations and preparing for investment.",
    outcomes: ["Refined business model", "Investor-ready pitch", "Growth roadmap"],
  },
  {
    icon: GraduationCap,
    title: "Training & Bootcamps",
    duration: "1–2 days",
    audience: "Anyone",
    desc: "Short, practical sessions on topics like business registration, digital marketing, and financial literacy.",
    outcomes: ["Certificate of completion", "Practical toolkit", "Peer network"],
  },
];

export default function IncubationProgramPage() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-white">
        <Reveal className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">Incubation Program</span>
          <h1 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">A track for every stage</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Whether you have a rough idea or a growing startup, NICC has a program
            designed to move you forward.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Stagger className="grid gap-6 sm:grid-cols-2" stagger={0.1}>
          {PROGRAMS.map(({ icon: Icon, title, duration, audience, desc, outcomes }) => (
            <StaggerItem key={title} className="rounded-2xl border border-gray-200 p-6">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-md shadow-navy-900/20">
                <Icon className="size-5" />
              </span>
              <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="size-3.5" />{duration}</span>
                <span className="flex items-center gap-1"><Users className="size-3.5" />{audience}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{desc}</p>
              <ul className="mt-4 space-y-1.5">
                {outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2 text-sm text-gray-500">
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-navy-400" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="relative overflow-hidden bg-navy-900">
        <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to apply?</h2>
          <p className="max-w-xl text-navy-200">
            Create a free account to start your application, or reach out with questions.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg" className="shadow-xl shadow-accent-500/30">
              Apply Now
            </Button>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
