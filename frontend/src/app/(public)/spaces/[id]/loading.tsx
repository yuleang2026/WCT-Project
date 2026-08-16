export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-12 sm:px-6">
      <div className="mb-6 h-6 w-28 rounded-full bg-gray-100" />

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 h-56 rounded-xl bg-gray-100" />
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
          </div>
        </div>

        <div className="h-64 rounded-xl border border-gray-200 bg-gray-50" />
      </div>
    </div>
  );
}
