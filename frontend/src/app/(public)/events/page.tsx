import type { Metadata } from "next";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = { title: "Events" };

const UPCOMING_EVENTS = [
  {
    date: "Aug 22, 2026",
    time: "2:00 PM",
    title: "Founder Office Hours",
    tag: "Mentorship",
    desc: "Drop-in sessions with NICC mentors — bring your questions on product, growth, or fundraising.",
    location: "NICC, RUPP Campus",
  },
  {
    date: "Sep 5, 2026",
    time: "9:00 AM",
    title: "Startup Bootcamp: Idea to MVP",
    tag: "Training",
    desc: "A one-day intensive on turning a rough idea into a testable minimum viable product.",
    location: "NICC, RUPP Campus",
  },
  {
    date: "Sep 19, 2026",
    time: "5:30 PM",
    title: "NICC Demo Day",
    tag: "Community",
    desc: "Current incubation cohort founders pitch to mentors, partners, and the public.",
    location: "NICC, RUPP Campus",
  },
  {
    date: "Oct 3, 2026",
    time: "10:00 AM",
    title: "Digital Marketing Clinic",
    tag: "Training",
    desc: "A practical workshop on building an audience and running low-budget marketing campaigns.",
    location: "NICC, RUPP Campus",
  },
];

const TAG_COLORS: Record<string, string> = {
  Mentorship: "bg-navy-50 text-navy-700",
  Training: "bg-navy-50 text-navy-700",
  Community: "bg-accent-100 text-accent-700",
};

export default function EventsPage() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-white">
        <Reveal className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">Events</span>
          <h1 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">Workshops & community meetups</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Join founders, mentors, and partners at NICC for hands-on workshops,
            office hours, and demo days.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8">
          <h2 className="text-xl font-semibold text-navy-900">Upcoming Events</h2>
        </Reveal>
        <Stagger className="space-y-4" stagger={0.1}>
          {UPCOMING_EVENTS.map((event) => (
            <StaggerItem key={event.title}>
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TAG_COLORS[event.tag] ?? "bg-gray-100 text-gray-700"}`}>
                    {event.tag}
                  </span>
                  <h3 className="mt-2 font-semibold text-navy-900">{event.title}</h3>
                  <p className="mt-1 max-w-lg text-sm text-gray-500">{event.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="size-3.5" />{event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" />{event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" />{event.location}</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
