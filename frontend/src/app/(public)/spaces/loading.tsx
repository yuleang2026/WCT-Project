export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-12 sm:px-6">
      <div className="h-8 w-56 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-80 max-w-full rounded bg-gray-100" />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-gray-100" />
          <div className="h-8 w-28 rounded-full bg-gray-100" />
          <div className="h-8 w-28 rounded-full bg-gray-100" />
        </div>
        <div className="h-8 w-full rounded-full bg-gray-100 sm:w-64" />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="h-40 bg-gray-100" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="mt-3 h-5 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
