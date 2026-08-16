import Link from "next/link";
import { Users, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Space } from "@/lib/types";

export function SpaceCard({ space }: { space: Space }) {
  const image = space.images?.[0];

  return (
    <Link
      href={`/spaces/${space.id}`}
      prefetch={false}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/10"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-navy-800">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={space.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-950 to-navy-850">
            <svg className="absolute inset-0 size-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute size-24 rounded-full bg-accent-500/10 blur-xl" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-accent-400 shadow-xl backdrop-blur transition-transform duration-300 group-hover:scale-110">
                {space.type === "event" ? <Users className="size-7" /> : <Building2 className="size-7" />}
              </span>
              <span className="text-[10px] font-bold tracking-wider text-navy-200 uppercase">
                {space.type === "event" ? "Event Space" : "Office Rental"}
              </span>
            </div>
          </div>
        )}
        <Badge tone={space.type === "event" ? "info" : "success"} className="absolute left-3 top-3 capitalize">
          {space.type === "event" ? "Event Space" : "Office Rental"}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-navy-900 group-hover:text-navy-700">{space.name}</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {space.capacity} capacity
          </span>
          {space.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {space.location}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-gray-500">{space.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-navy-900">
            {formatCurrency(space.price)}
            <span className="text-xs font-normal text-gray-500"> / {space.price_unit}</span>
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-accent-600">
            View details
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
