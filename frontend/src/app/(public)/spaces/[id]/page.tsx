import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, MapPin, Wallet, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchSpace } from "@/lib/server/publicApi";
import { getCurrentUser } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem, MotionDiv } from "@/components/ui/motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const space = await fetchSpace(id);
  return { title: space?.name ?? "Space" };
}

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [space, user] = await Promise.all([fetchSpace(id), getCurrentUser()]);

  if (!space) notFound();

  const bookingHref =
    space.type === "event"
      ? `/dashboard/bookings/new/event?space=${space.id}`
      : `/dashboard/bookings/new/office?space=${space.id}`;

  const ctaHref = user ? bookingHref : `/login?redirect=${encodeURIComponent(bookingHref)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Reveal className="mb-6 flex items-center gap-3">
        <Badge tone={space.type === "event" ? "info" : "success"} className="capitalize">
          {space.type === "event" ? "Event Space" : "Office Rental"}
        </Badge>
        <Badge status={space.status}>{space.status}</Badge>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex h-56 items-center justify-center rounded-xl bg-navy-800 text-5xl font-bold text-navy-600 overflow-hidden"
          >
            {space.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={space.images[0]} alt={space.name} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-950 to-navy-850">
                <svg className="absolute inset-0 size-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-large" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-large)" />
                </svg>
                <div className="absolute size-32 rounded-full bg-accent-500/10 blur-xl" />
                <div className="relative flex flex-col items-center gap-2">
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-accent-400 shadow-xl backdrop-blur">
                    {space.type === "event" ? <Users className="size-8" /> : <Building2 className="size-8" />}
                  </span>
                  <span className="text-xs font-bold tracking-wider text-navy-200 uppercase">
                    {space.type === "event" ? "Event Space" : "Office Rental"}
                  </span>
                </div>
              </div>
            )}
          </MotionDiv>

          <Reveal delay={0.1}>
            <h1 className="text-3xl font-bold text-navy-900">{space.name}</h1>
            <p className="mt-3 whitespace-pre-line text-gray-600">{space.description}</p>
          </Reveal>

          {space.amenities && space.amenities.length > 0 && (
            <Reveal delay={0.15} className="mt-6">
              <h2 className="mb-2 font-semibold text-navy-900">Amenities</h2>
              <Stagger className="flex flex-wrap gap-2" stagger={0.04}>
                {space.amenities.map((a) => (
                  <StaggerItem key={a}>
                    <span className="rounded-full bg-navy-50 px-3 py-1 text-sm text-navy-700">{a}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          )}
        </div>

        <MotionDiv
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="sticky top-20 rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-3xl font-bold text-navy-900">
              {formatCurrency(space.price)}
              <span className="text-sm font-normal text-gray-500"> / {space.price_unit}</span>
            </p>

            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Users className="size-4 text-navy-500" /> Capacity: {space.capacity} people
              </li>
              {space.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-navy-500" /> {space.location}
                </li>
              )}
              <li className="flex items-center gap-2">
                <Wallet className="size-4 text-navy-500" /> Deposit: {formatCurrency(space.deposit_amount)}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-navy-500" /> Instant availability check
              </li>
            </ul>

            <Link href={ctaHref} className="mt-6 block">
              <Button variant="primary" size="lg" className="w-full" disabled={space.status !== "active"}>
                {space.status === "active" ? "Book This Space" : "Currently Unavailable"}
              </Button>
            </Link>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
