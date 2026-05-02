export default function Loading() {
  return (
    <div className="space-y-12 animate-fade-up">
      <section className="space-y-6 py-12 lg:py-16 text-center flex flex-col items-center">
        <div className="h-6 w-48 skeleton rounded-full mb-2"></div>
        <div className="h-14 w-full max-w-2xl skeleton rounded-xl"></div>
        <div className="h-14 w-full max-w-xl skeleton rounded-xl mt-2"></div>
        <div className="h-6 w-full max-w-lg skeleton rounded-md mt-6"></div>
      </section>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="h-10 w-24 skeleton rounded-full"></div>
          <div className="h-10 w-32 skeleton rounded-full"></div>
          <div className="h-10 w-28 skeleton rounded-full"></div>
        </div>
        <div className="h-5 w-20 skeleton rounded-md"></div>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="h-44 w-full skeleton"></div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="h-4 w-32 skeleton rounded-md"></div>
              <div className="h-6 w-full skeleton rounded-md mt-2"></div>
              <div className="h-6 w-3/4 skeleton rounded-md"></div>
              <div className="flex gap-2 mt-auto pt-4">
                <div className="h-6 w-16 skeleton rounded-full"></div>
                <div className="h-6 w-16 skeleton rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
