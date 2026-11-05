"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAcademy } from "./provider";
import { bi as b } from "@/lib/types";
export function ComplexityChart({ n }: { n: number }) {
  const data = Array.from({ length: 11 }, (_, i) => {
    const x = Math.max(1, Math.round((i * n) / 10));
    return { n: x, "O(1)": 1, "O(n)": x, "O(n²)": x * x };
  });
  return (
    <div className="chart-wrap">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
        >
          <CartesianGrid stroke="#53654d33" strokeDasharray="3 3" />
          <XAxis dataKey="n" stroke="#8b9c85" fontSize={10} />
          <YAxis
            scale="log"
            domain={[1, "auto"]}
            stroke="#8b9c85"
            fontSize={10}
            allowDataOverflow
          />
          <Tooltip
            contentStyle={{
              background: "#182018",
              border: "1px solid #53654d",
              color: "#ddd",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line dataKey="O(1)" stroke="#aacb96" dot={false} />
          <Line dataKey="O(n)" stroke="#d4b28f" dot={false} />
          <Line dataKey="O(n²)" stroke="#bc96c5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function PracticeChart() {
  const { state, t } = useAcademy();
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const day = date.toLocaleDateString(
      state.locale === "az" ? "az-AZ" : "en-GB",
      { month: "short", day: "numeric" },
    );
    const entries = state.attempts.filter(
      (a) => new Date(a.at).toDateString() === date.toDateString(),
    );
    return {
      day,
      correct: entries.filter((a) => a.correct).length,
      incorrect: entries.filter((a) => !a.correct).length,
    };
  });
  return (
    <div className="chart-wrap">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#53654d33" vertical={false} />
          <XAxis dataKey="day" fontSize={10} stroke="#8b9c85" />
          <YAxis allowDecimals={false} fontSize={10} stroke="#8b9c85" />
          <Tooltip
            contentStyle={{
              background: "#182018",
              border: "1px solid #53654d",
              color: "#ddd",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            dataKey="correct"
            name={t(b("Correct", "Düzgün"))}
            fill="#9fb98d"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="incorrect"
            name={t(b("Needs another look", "Yenidən baxılmalı"))}
            fill="#c49a79"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
