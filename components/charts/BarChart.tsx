"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReuseableBarChart({ data, xKey, yKey}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}
         margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
        {/* DEFINISI GRADIENT */}
          <defs>
            <linearGradient id="1Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e39ceff" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#7d05b5ff" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
        <Bar 
            dataKey={yKey} 
            fill="url(#1Gradient)" 
            radius={[8, 8, 0, 0]}
          />
      </BarChart>
    </ResponsiveContainer>
  );
}