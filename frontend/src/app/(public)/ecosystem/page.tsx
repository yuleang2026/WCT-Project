import type { Metadata } from "next";
import Link from "next/link";
import { Users2, Rocket, ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = { title: "Ecosystem Builder" };

export default function EcosystemPage() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-white">
        <Reveal className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">Ecosystem Builder</span>
          <h1 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">Mentors and startups, in one place</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            The directory connecting Cambodia&apos;s founders with mentors, and
            showcasing the startups building through NICC.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Stagger className="grid gap-6 sm:grid-cols-2" stagger={0.12}>
          <StaggerItem className="rounded-2xl border border-gray-200 p-8">
            <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-md shadow-navy-900/20">
              <Users2 className="size-5" />
            </span>
            <span className="mb-1 inline-block rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700">
              Coming soon
            </span>
            <h2 className="text-xl font-semibold text-navy-900">Mentor Directory</h2>
            <p className="mt-2 text-sm text-gray-600">
              Browse mentors by industry and expertise, and request a match — from
              product and fundraising to operations and marketing.
            </p>
            <Link href="/register" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline">
              Apply to be a mentor <ArrowRight className="size-3.5" />
            </Link>
          </StaggerItem>

          <StaggerItem className="rounded-2xl border border-gray-200 p-8">
            <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white shadow-md shadow-navy-900/20">
              <Rocket className="size-5" />
            </span>
            <span className="mb-1 inline-block rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700">
              Coming soon
            </span>
            <h2 className="text-xl font-semibold text-navy-900">Startup Directory</h2>
            <p className="mt-2 text-sm text-gray-600">
              A public showcase of startups built through NICC&apos;s programs —
              what they do, what stage they&apos;re at, and how to reach them.
            </p>
            <Link href="/register" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline">
              List your startup <ArrowRight className="size-3.5" />
            </Link>
          </StaggerItem>
        </Stagger>
      </section>

      <section className="relative overflow-hidden bg-navy-900">
        <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Want early access?</h2>
          <p className="max-w-xl text-navy-200">
            Create a free account now and we&apos;ll notify you when the directory opens.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-base font-medium text-navy-900 shadow-sm transition-colors hover:bg-navy-50"
          >
            Get Started
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
