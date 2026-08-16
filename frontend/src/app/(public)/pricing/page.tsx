import type { Metadata } from "next";
import Link from "next/link";
import { fetchSpaces } from "@/lib/server/publicApi";
import { formatCurrency } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { PricingCalculator } from "@/components/PricingCalculator";

export const metadata: Metadata = { title: "Pricing" };

export default async function PricingPage() {
  const [{ data: events }, { data: offices }] = await Promise.all([
    fetchSpaces({ type: "event", per_page: "50" }),
    fetchSpaces({ type: "office", per_page: "50" }),
  ]);

  const allSpaces = [...events, ...offices];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold text-navy-900">Pricing</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Transparent, real-time pricing for every space at NICC. A deposit is required to
          confirm any booking — the remaining balance is invoiced after approval.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10" as="section">
        <h2 className="mb-4 text-xl font-semibold text-navy-900">Event Spaces (billed hourly / daily)</h2>
        <PricingTable spaces={events} />
      </Reveal>

      <Reveal delay={0.1} className="mt-12" as="section">
        <h2 className="mb-4 text-xl font-semibold text-navy-900">Office Rentals (billed monthly)</h2>
        <PricingTable spaces={offices} />
      </Reveal>

      <Reveal delay={0.2}>
        <PricingCalculator spaces={allSpaces} />
      </Reveal>
    </div>
  );
}

function PricingTable({ spaces }: { spaces: { id: number; name: string; capacity: number; price: string; price_unit: string; deposit_amount: string }[] }) {
  if (spaces.length === 0) {
    return <p className="text-sm text-gray-500">No spaces available in this category yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-navy-800 text-white">
          <tr>
            <th className="px-4 py-3 font-medium">Space</th>
            <th className="px-4 py-3 font-medium">Capacity</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Deposit</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <Stagger as="tbody" className="divide-y divide-gray-100 bg-white">
          {spaces.map((space) => (
            <StaggerItem key={space.id} as="tr" y={8}>
              <td className="px-4 py-3 font-medium text-navy-900">{space.name}</td>
              <td className="px-4 py-3 text-gray-600">{space.capacity}</td>
              <td className="px-4 py-3 text-gray-600">
                {formatCurrency(space.price)} / {space.price_unit}
              </td>
              <td className="px-4 py-3 text-gray-600">{formatCurrency(space.deposit_amount)}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/spaces/${space.id}`} className="font-medium text-accent-600 hover:underline">
                  View
                </Link>
              </td>
            </StaggerItem>
          ))}
        </Stagger>
      </table>
    </div>
  );
}
