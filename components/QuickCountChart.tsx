"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ["#2563eb", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function QuickCountChart() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/stats");
      const json = await res.json();
      setData(json);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Update setiap 3 detik
    return () => clearInterval(interval);
  }, []);

  if (!data)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Partisipasi
          </span>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800">
              {data.participation}%
            </span>
            <span className="text-sm text-slate-400 mb-1">dari DPT</span>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Suara Masuk
          </span>
          <span className="block text-3xl font-black text-blue-600">
            {data.totalVotes}
          </span>
        </div>
        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Belum Memilih
          </span>
          <span className="block text-3xl font-black text-slate-400">
            {data.totalTokens - data.totalVotes}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.chartData}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border-none">
                      <p className="text-xs font-bold opacity-60 uppercase">
                        {payload[0].payload.name}
                      </p>
                      <p className="text-xl font-black">
                        {payload[0].value} Suara
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="suara" radius={[12, 12, 12, 12]} barSize={60}>
              {data.chartData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
