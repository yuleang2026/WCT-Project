import Link from "next/link";
import { CalendarDays, Building2, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/motion";

export default function NewBookingChooserPage() {
  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">New Booking</h1>
        <p className="text-sm text-gray-500">What would you like to book?</p>
      </Reveal>

      <Reveal delay={0.08} className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/bookings/new/event"
          className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 hover:border-navy-400 hover:shadow-sm"
        >
          <CalendarDays className="size-8 text-navy-700" />
          <h2 className="text-lg font-semibold text-navy-900">Event Space</h2>
          <p className="text-sm text-gray-500">
            Book a conference hall or meeting room for a single-day event, with optional equipment.
          </p>
          <span className="mt-auto flex items-center gap-1 text-sm font-medium text-accent-600">
            Book an event <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/dashboard/bookings/new/office"
          className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 hover:border-navy-400 hover:shadow-sm"
        >
          <Building2 className="size-8 text-navy-700" />
          <h2 className="text-lg font-semibold text-navy-900">Office Rental</h2>
          <p className="text-sm text-gray-500">
            Lease a private office on a monthly basis. Requires company details and documents.
          </p>
          <span className="mt-auto flex items-center gap-1 text-sm font-medium text-accent-600">
            Rent an office <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
