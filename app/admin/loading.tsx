export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-60 bg-[#E7E5E4] rounded-full" />
          <div className="h-4 w-52 bg-[#E7E5E4] rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-[#E7E5E4] rounded-full" />
          <div className="h-9 w-36 bg-[#E7E5E4] rounded-full" />
        </div>
      </div>

      {/* Bento Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
            <div className="h-4 w-28 bg-[#E7E5E4] rounded-full" />
            <div className="h-10 w-20 bg-[#E7E5E4] rounded-lg" />
            <div className="h-3 w-32 bg-[#E7E5E4] rounded-full" />
          </div>
        ))}

        <div className="col-span-1 lg:col-span-2 h-56 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-5 w-48 bg-[#E7E5E4] rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="h-10 w-full bg-[#E7E5E4] rounded-2xl" />
            <div className="h-10 w-full bg-[#E7E5E4] rounded-2xl" />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 h-56 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-5 w-48 bg-[#E7E5E4] rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="h-10 w-full bg-[#E7E5E4] rounded-2xl" />
            <div className="h-10 w-full bg-[#E7E5E4] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
