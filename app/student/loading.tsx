export default function StudentLoading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="p-6 bg-[#F9F8F4] border border-[#E7E5E4] rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-[#E7E5E4] rounded-full" />
          <div className="h-4 w-40 bg-[#E7E5E4] rounded-full" />
        </div>
        <div className="h-9 w-36 bg-[#E7E5E4] rounded-full" />
      </div>

      {/* Bento Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-44 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-4 w-28 bg-[#E7E5E4] rounded-full" />
          <div className="h-10 w-20 bg-[#E7E5E4] rounded-lg" />
          <div className="h-3 w-full bg-[#E7E5E4] rounded-full" />
        </div>

        <div className="h-44 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-4 w-28 bg-[#E7E5E4] rounded-full" />
          <div className="h-10 w-20 bg-[#E7E5E4] rounded-lg" />
          <div className="h-3 w-full bg-[#E7E5E4] rounded-full" />
        </div>

        <div className="col-span-1 md:col-span-2 h-44 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-4 w-32 bg-[#E7E5E4] rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-3/4 bg-[#E7E5E4] rounded-lg" />
            <div className="h-6 w-1/2 bg-[#E7E5E4] rounded-lg" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 h-64 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-4 w-40 bg-[#E7E5E4] rounded-full" />
          <div className="h-40 w-full bg-[#E7E5E4] rounded-2xl" />
        </div>

        <div className="col-span-1 md:col-span-2 h-64 bg-[#F9F8F4] border border-[#E7E5E4] rounded-3xl p-5 flex flex-col justify-between">
          <div className="h-4 w-40 bg-[#E7E5E4] rounded-full" />
          <div className="h-40 w-full bg-[#E7E5E4] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
