"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export interface MonthlyTrendPoint {
  month: string; // e.g. "Jan", "Feb", "Mar"
  percentage: number; // 0 - 100
  presentDays: number;
  workingDays: number;
}

interface AttendanceTrendChartProps {
  data: MonthlyTrendPoint[];
  targetThreshold?: number;
  height?: number;
}

export function AttendanceTrendChart({
  data,
  targetThreshold = 75,
  height = 220,
}: AttendanceTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-[#78716C] italic">
        No monthly attendance data recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
        <span className="font-medium">Monthly Percentage Trend</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-0.5 bg-red-500 rounded-full" />
          <span>75% Target Threshold</span>
        </span>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FACC15" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #262626",
                borderRadius: "12px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) => [`${val ?? 0}%`, "Attendance"]}
            />
            <ReferenceLine y={targetThreshold} stroke="#EF4444" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#1C1917"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#attendanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
