"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
// Import Recharts
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
// Import Icons
import {
  Activity,
  AlertCircle,
  ChevronDown,
  Film,
  Filter,
  Globe,
  Map as MapIcon,
  PieChart as PieIcon,
  Star,
  Users,
} from "lucide-react";

// --- HIGHCHARTS IMPORTS ---
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import { regions } from "../../../../../db/queries/title/attributes.ts";

// --- KONSTANTA WARNA ---
const COLOR_PRIMARY = "#ff3b3b";

const ChoroplethMap = ({ data }: {}) => {
  const [metric, setMetric] = useState<"rating" | "votes">("votes");
  const [isOpen, setIsOpen] = useState(false);

  const rawMapData = data?.region_data?.map?.((r) =>
    r = {
      key: String(r.region_code).toLowerCase(),
      name: r.region_name,
      rating: r.average_rating,
      votes: r.rate_count,
    }
  );

  // FIX: Load Map Module secara aman
  useEffect(() => {
    if (typeof window !== "undefined" && Highcharts) {
      try {
        const mapModule = require("highcharts/modules/map");
        mapModule(Highcharts);
      } catch (e) {
        console.warn("Highcharts map module already loaded");
      }
    }
  }, []);

  // Transform Data sesuai Metric
  const chartData = rawMapData?.map(
    (item) => [item?.key, metric === "rating" ? item?.rating : item?.votes],
  );

  const values = chartData?.map?.((d) => d?.[1] as number);
  const minVal = values ? Math?.min?.(...values) : 0;
  const maxVal = values ? Math?.max?.(...values) : 0;

  /* =======================
     OPTIONS
  ======================= */
  const options: Highcharts.Options = {
    chart: {
      map: worldMap as any,
      backgroundColor: "transparent",
      height: 420,
      style: { fontFamily: "inherit" },
    },
    title: { text: undefined },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "#9ca3af",
        fontWeight: "bold",
        fontSize: "10px",
        textTransform: "uppercase",
      },
      symbolWidth: 300,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
        align: "right",
        theme: {
          fill: "#1a1a1a",
          stroke: "#333",
          style: { color: "white" },
          states: {
            hover: { fill: "#333" },
            select: { fill: "#ff3b3b" },
          },
        },
      },
    },
    colorAxis: {
      min: minVal,
      max: maxVal,
      stops: [
        [0, "#330000"],
        [0.5, "#ff3b3b"],
        [1, "#ff9999"],
      ],
      labels: { style: { color: "#9ca3af" } },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      borderColor: "#ff3b3b",
      borderRadius: 8,
      style: { color: "#fff" },
      headerFormat: "",
      pointFormat: metric === "rating"
        ? "<span style='font-size: 10px; text-transform:uppercase; color: #999'>{point.name}</span><br/><span style='font-size: 16px; font-weight: bold; color: #ff3b3b'><span style='color:yellow'>★</span> {point.value}</span> / 10"
        : "<span style='font-size: 10px; text-transform:uppercase; color: #999'>{point.name}</span><br/><span style='font-size: 16px; font-weight: bold; color: #ff3b3b'>{point.value:,.0f}</span> Votes",
    },
    series: [
      {
        type: "map",
        name: metric === "rating" ? "Avg Rating" : "Total Votes",
        data: chartData,
        joinBy: ["hc-key", 0],
        borderColor: "#121212",
        borderWidth: 1,
        nullColor: "#2a2a2a",
        states: {
          hover: {
            color: "#ffffff",
            brightness: 0.1,
          },
        },
        dataLabels: { enabled: false },
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 h-[500px] relative overflow-hidden group flex flex-col">
      {/* HEADER DENGAN DROPDOWN */}
      <div className="flex justify-between items-start mb-2 z-10">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <MapIcon size={18} className="text-[#ff3b3b]" /> Global Demand Map
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Intensity by{" "}
            {metric === "rating" ? "Quality Score" : "Audience Volume"}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg hover:text-white transition-colors border border-white/5"
          >
            Metric: <span className="text-[#ff3b3b] uppercase">{metric}</span>
            {" "}
            <ChevronDown size={14} />
          </button>
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-[99] animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setMetric("votes");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase transition-colors ${
                  metric === "votes"
                    ? "text-white bg-[#ff3b3b]"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Votes
              </button>
              <button
                onClick={() => {
                  setMetric("rating");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase transition-colors ${
                  metric === "rating"
                    ? "text-white bg-[#ff3b3b]"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Rating
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="w-full flex-1 rounded-2xl overflow-hidden">
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="mapChart"
          options={options}
        />
      </div>
    </div>
  );
};

// ==========================================
// DATA MOCKUP (DUMMY)
// ==========================================

// EXECUTIVE DATA
const execKPIData = {
  totalFilms: "1,245",
  topGenre: "Action",
  topGenrePercent: "34%",
  topRatedGenre: "Animation",
  topRatedGenreVal: "8.9",
  avgRatingAll: "7.4",
};

const quantityQualityData = Array.from({ length: 15 }, (_, i) => ({
  x: Math.floor(Math.random() * 100) + 10,
  y: parseFloat(((Math.random() * 4) + 5).toFixed(1)),
  z: Math.floor(Math.random() * 50000) + 1000,
}));

// --- COMPONENT: KPI CARD ---
const KPICard = (
  {
    title,
    value,
    subtext,
    subsubtext = null,
    icon: Icon,
    color = "text-white",
  }: any,
) => (
  <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#ff3b3b]/30 transition-all">
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#ff3b3b]/10" />
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          {title}
        </p>
        <h3 className={`text-3xl font-black ${color} mb-1`}>{value}</h3>
        <p className="text-xs text-gray-500">{subtext}</p>
        <p hidden={!subsubtext} className="text-xs text-gray-500">{subtext}</p>
      </div>
      {Icon && (
        <div className="p-3 bg-white/5 rounded-xl text-[#ff3b3b]">
          <Icon size={24} />
        </div>
      )}
    </div>
  </div>
);

// --- COMPONENT: DYNAMIC CHART CONTAINER ---
const ChartContainer = (
  {
    title,
    subtitle,
    children,
    filterOptions,
    currentFilter,
    onFilterChange,
    height = "h-[450px]",
  }: any,
) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-[#121212] p-6 rounded-2xl border border-white/5 flex flex-col ${height} relative`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>

        {filterOptions && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg hover:text-white transition-colors border border-white/5"
            >
              Metric:{" "}
              <span className="text-[#ff3b3b] uppercase">
                {currentFilter.replace("_", " ")}
              </span>{" "}
              <ChevronDown size={14} />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-[99] animate-in fade-in zoom-in-95 duration-200">
                {filterOptions.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onFilterChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase transition-colors 
                      ${
                      currentFilter === opt
                        ? "text-white bg-[#ff3b3b]"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                    `}
                  >
                    {opt.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 w-full min-h-0 relative z-0">
        {children}
      </div>
    </div>
  );
};

// --- GLOBAL GRADIENTS DEFS ---
const ChartGradients = () => (
  <svg style={{ height: 0, width: 0, position: "absolute" }}>
    <defs>
      <linearGradient id="barGradientRed" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ff3b3b" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>

      <linearGradient id="areaGradientRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ff3b3b" stopOpacity={0.4} />
        <stop offset="95%" stopColor="#ff3b3b" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

// ==========================================
// VIEW: EXECUTIVE DASHBOARD
// ==========================================
type ViewProps = {
  data?: any;
  global_data?: any;
  company_details?: {};
  is_current_company?: boolean;
};
const ExecutiveView = (
  { data, global_data, company_details, is_current_company }: ViewProps,
) => {
  const [compMetric, setCompMetric] = useState("rating");
  const [trendMetric, setTrendMetric] = useState("Rating");
  const [yearBack, setYearBack] = useState(10);

  const topCompaniesDataRaw = global_data?.top_companies_rating_data?.map?.((
    t,
  ) => ({
    name: t?.company_name,
    rating: t?.average_rating,
    vote_count: t?.rate_count,
  }));

  const sortedCompanies = topCompaniesDataRaw
    ? [...topCompaniesDataRaw]?.sort?.((a: any, b: any) =>
      b?.[compMetric] - a?.[compMetric]
    )
      ?.slice?.(0, 5)
    : [];

  const title_count = data?.genre_data?.length !== 0
    ? data?.genre_data?.reduce?.(
      (sum: number, x: { title_count: number }) => sum + x.title_count,
      0,
    )
    : 0;
  const avg = ((r) => (r.c ? r.s / r.c : null))(
    (data?.genre_data ?? []).reduce(
      (a, g) => ({
        s: a.s + (g.average_rating ?? 0) * (g.rate_count ?? 0),
        c: a.c + (g.rate_count ?? 0),
      }),
      { s: 0, c: 0 },
    ),
  );
  const success = data?.title_success_data?.find?.((s) =>
    s?.indicator === "Success"
  )?.title_count;
  const failed = data?.title_success_data?.find?.((s) =>
    s?.indicator === "Failed"
  )?.title_count;
  const successPercent = (success / (success + failed) * 100).toFixed(2);
  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <ChartGradients />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Production"
          value={data?.total_production}
          subtext="Films produced all time"
          icon={Film}
        />
        <KPICard
          title="Top Genre Volume"
          value={data?.genre_data?.[0]?.genre}
          subtext={`${
            (data?.genre_data?.[0]?.title_count / title_count *
              100).toFixed(2)
          }% of total library`}
          icon={PieIcon}
          color="text-[#ff3b3b]"
        />
        <KPICard
          title="Highest Quality"
          value={execKPIData.topRatedGenre}
          subtext={`Avg Rating: ${execKPIData.topRatedGenreVal}`}
          icon={Star}
          color="text-yellow-400"
        />
        <KPICard
          title="Avg Rating"
          value={data?.average_rating?.toFixed(2)}
          subtext="Across all productions"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Top 5 Production Companies"
            subtitle={`Ranked by ${compMetric.replace("_", " ")} (Descending)`}
            filterOptions={["rating", "vote_count"]}
            currentFilter={compMetric}
            onFilterChange={setCompMetric}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedCompanies}
                layout="vertical"
                margin={{ left: 10, right: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#666" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#fff"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #333",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey={compMetric}
                  fill="url(#barGradientRed)"
                  radius={[0, 4, 4, 0]}
                  barSize={30}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 text-white font-bold text-lg">
            Success Rate
          </h3>
          <p className="absolute top-12 left-6 text-xs text-gray-500">
            Films rated &gt; 8.0
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={[{
                name: "Success",
                value: successPercent,
                fill: "#ff3b3b",
              }]}
              startAngle={180}
              endAngle={0}
              cy="60%"
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "#333" }}
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-5xl font-black"
              >
                {successPercent}%
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500 text-sm font-bold tracking-widest"
              >
                SUCCESS
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Quantity vs Quality Matrix"
          subtitle="X: Quantity, Y: Rating, Size: Votes"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                type="number"
                dataKey="x"
                name="Quantity"
                stroke="#666"
                label={{
                  value: "Quantity",
                  position: "insideBottomRight",
                  offset: -5,
                  fill: "#666",
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Quality"
                stroke="#666"
                domain={[0, 10]}
                label={{
                  value: "Rating",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#666",
                }}
              />
              <ZAxis
                type="number"
                dataKey="z"
                range={[100, 800]}
                name="Votes"
              />
              <RechartsTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload?.[0]?.payload;
                    return (
                      <div className="bg-black border border-white/20 p-3 rounded-lg shadow-xl text-white">
                        <p className="font-bold text-sm mb-1 text-[#ff3b3b]">
                          Point Data
                        </p>
                        <p className="text-xs text-gray-300">
                          Quantity: {data.x}
                        </p>
                        <p className="text-xs text-gray-300">
                          Rating: {data.y}
                        </p>
                        <p className="text-xs text-gray-300">
                          Votes: {data.z.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Films"
                data={quantityQualityData}
                fill="#ff3b3b"
                fillOpacity={0.6}
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* REVISI: METRIC GANTI JADI RATING & VOTE */}
        <ChartContainer
          title="Yearly Performance Trend"
          subtitle={`Trend of ${trendMetric} over time`}
          filterOptions={["Rating", "Vote"]} // <-- GANTI REVENUE JADI VOTE
          currentFilter={trendMetric}
          onFilterChange={setTrendMetric}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.company_yearly_performance_data?.filter((c) =>
                c.year > (new Date().getFullYear() - yearBack)
              )?.map((c) => ({
                year: String(c.year),
                Rating: Number(c.average_rating),
                Vote: Number(c.rate_count),
              })) ?? []}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis dataKey="year" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                domain={trendMetric === "Rating" ? [5, 10] : [0, "auto"]}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey={trendMetric}
                stroke="#ff3b3b"
                fill="url(#areaGradientRed)"
                strokeWidth={3}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

// ==========================================
// VIEW: MARKETING DASHBOARD
// ==========================================

const MarketingView = (
  { data, global_data, company_details, is_current_company }: ViewProps,
) => {
  const total = data?.language_data?.length !== 0
    ? data?.language_data?.reduce?.(
      (sum: number, x: { title_count: number }) => sum + x.title_count,
      0,
    )
    : 0;
  const localized = data?.language_data?.length !== 0
    ? data?.language_data?.filter?.((l) => l.language_code !== null)?.reduce?.(
      (sum: number, x: { title_count: number }) => sum + x.title_count,
      0,
    )
    : 0;
  const unlocalized = total - localized;
  const localizedPercent = ((localized / total) * 100)
    ?.toFixed(2);
  const unlocalizedPercent = (100 - localizedPercent)
    ?.toFixed(2);
  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <ChartGradients />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Top Avg Rating"
          value={data?.region_data?.[0]?.region_code}
          subtext={`Score: ${data?.region_data?.[0]?.average_rating ?? 0}`}
          icon={Star}
          color="text-yellow-400"
        />

        <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 relative group hover:border-[#ff3b3b]/30 transition-all flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Audience Extremes
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-black text-white">
                {data?.region_data?.[0]?.region_code ?? 0}
              </span>
              <span className="text-[10px] font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded uppercase tracking-wider">
                {data?.region_data?.[0]?.rate_count ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-400">
                {data?.region_data?.[data?.region_data.length - 1]
                  ?.region_code ?? 0}
              </span>
              <span className="text-[10px] font-bold text-red-400 bg-red-900/20 px-2 py-1 rounded uppercase tracking-wider">
                {data?.region_data?.[data?.region_data.length - 1]
                  ?.rate_count ?? 0}
              </span>
            </div>
          </div>
          <div className="absolute top-4 right-4 p-2 bg-white/5 rounded-xl text-[#0ea5e9]">
            <Users size={20} />
          </div>
        </div>

        <KPICard
          title="Most Localized"
          value={data?.language_data?.[0]?.language_code ?? 0}
          subtext={data?.language_data?.[0]?.title_count ?? 0}
          icon={Globe}
          color="text-green-400"
        />
        <KPICard
          title="Localization Gap"
          value={`${unlocalizedPercent}%`}
          subtext={`${unlocalized} Unlocalized`}
          icon={AlertCircle}
          color="text-[#ff3b3b]"
        />
      </div>

      {/* Row 1: Choropleth Map with Metric Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PENETRATION CHART */}
        <div className="lg:col-span-2">
          <ChoroplethMap data={data} />
        </div>
        <ChartContainer
          title={`${
            is_current_company ? company_details?.company_name : "Global"
          } Penetration`}
          subtitle="Demand vs Supply"
          height="h-[500px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.region_data?.map((r) => ({
                name: r.region_code,
                supply: r.title_count,
                interest: global_data?.region_data?.find?.(
                  (g) => g.region_code === r.region_code,
                )?.title_count ?? 0,
              }))}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar
                dataKey="interest"
                fill="#333"
                name="Market Demand"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="supply"
                fill="url(#barGradientRed)"
                name={`${
                  is_current_company ? company_details?.company_name : "Global"
                } Supply`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Row 2: Votes, AKA, Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer
          title="Top 5 Countries by Votes"
          subtitle="Audience Volume"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.region_data?.map?.((r) =>
                r = { name: r.region_name, votes: r.rate_count }
              )}
              layout="vertical"
              margin={{ left: 10, right: 30 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#fff"
                width={60}
                fontSize={11}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #333",
                }}
              />
              <Bar
                dataKey="votes"
                fill="url(#barGradientRed)"
                radius={[0, 4, 4, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 h-[450px]">
          <h3 className="text-white font-bold text-lg mb-1">
            Localization Status
          </h3>
          <p className="text-xs text-gray-500 mb-4">AKA Availability</p>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={[{
                  name: "Localized",
                  value: localizedPercent,
                }, {
                  name: "Missing",
                  value: unlocalizedPercent,
                }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="localized" fill="url(#barGradientRed)" />
                <Cell key="missing" fill="#333" />
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-3xl font-black"
              >
                {localizedPercent}%
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500 text-sm font-bold uppercase"
              >
                Localized
              </text>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RATING DISTRIBUTION CHART */}
        <ChartContainer
          title="Rating Distribution"
          subtitle="Audience score breakdown"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.title_rating_bin_data?.map?.((t) =>
                t = { range: t.rating_bin, count: t.title_count }
              )}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis
                dataKey="range"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="count"
                name="Titles"
                fill="url(#barGradientRed)"
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export function DashboardContent() {
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role");
  const setRole = (r) => {
    router.push(`?role=${r}`, { scroll: false });
  };

  const { company_id } = useParams<{ company_id: string }>();
  const [companyDetails, setCompanyDetails] = useState({});

  const [data, setData] = useState(null);
  const [number, setNumber] = useState<number | null>(null);
  const [genre, setGenre] = useState<{} | null>({
    current_company: null,
    all_company: null,
  });
  const [year, setYear] = useState<{}>({
    current_company: 0,
    all_company: 0,
  });
  const [type, setType] = useState<{}>({
    current_company: null,
    all_company: null,
  });
  const [region, setRegion] = useState<{}>({
    current_company: null,
    all_company: null,
  });
  const [sort_by, setSortBy] = useState<{}>({
    current_company: null,
    all_company: null,
  });
  const [is_current_company, setIsCurrentCompany] = useState<boolean>(true);
  const [use_data, setUseData] = useState<string>("current_company");

  useEffect(() => {
    is_current_company
      ? setUseData("current_company")
      : setUseData("all_company");
  }, [is_current_company]);

  useEffect(() => {
    is_current_company
      ? setUseData("current_company")
      : setUseData("all_company");
  }, [company_id, role]);

  type Attributes = {
    all_company: {
      genres: string[];
      types: string[];
      years: string[];
      regions: string[];
    } | null;
    current_company: {
      genres: string[];
      types: string[];
      years: string[];
      regions: string[];
    } | null;
  };

  const [attributes, setAttributes] = useState<Attributes>({
    all_company: null,
    current_company: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [attributesLoading, setAttributesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setAttributesLoading(true);

        const [current_company, all_company, current_company_detail] =
          await Promise.all([
            fetch(`/api/company/${company_id}/attributes?type=all`, {
              cache: "force-cache",
              next: { tags: [`attribute-company-${company_id}-all`] },
            }).then((r) => r.json()),
            fetch(`/api/company/0/attributes?type=all`, {
              cache: "force-cache",
              next: { tags: ["attribute-company-0-all"] },
            }).then((r) => r.json()),
            fetch(`/api/company/${company_id}/details`, {
              cache: "force-cache",
              next: { tags: [`company-${company_id}-details`] },
            }).then((r) => r.json()),
          ]);

        console.log("Current company:", current_company);
        console.log("All company:", all_company);

        setCompanyDetails(current_company_detail);
        setAttributes({
          all_company,
          current_company,
        });
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
      } finally {
        setAttributesLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  async function fetchData(
    company_id: number,
    type: string,
    params: Record<string, string | number | null | undefined>,
    role_type: "marketing" | "executive" = "marketing",
  ) {
    const search = new URLSearchParams();
    search.set("type", type);

    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        search.set(k, String(v));
      }
    });

    const url =
      `/api/company/${company_id}/${role_type}/dashboard?${search.toString()}`;
    console.log("Fetching:", url);

    const res = await fetch(url, {
      cache: "no-store", // Client-side fetch doesn't support next.tags/revalidate
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Fetch failed:", errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return res.json();
  }

  useEffect(() => {
    const run = async () => {
      if (attributesLoading || !company_id || role !== "marketing") {
        console.log("Skipping fetch - not ready");
        return;
      }

      setLoading(true);

      const fetchParams = {
        number,
        sort_by: sort_by[use_data],
        region: region[use_data],
        year: year[use_data],
        title_type: type[use_data],
        genre: genre[use_data],
      };

      console.log("Fetching with params:", fetchParams);

      const [region_data, language_data, title_rating_bin_data] = await Promise
        .all(
          [
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_region_rating",
              fetchParams,
            ),
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_language_title_count",
              fetchParams,
            ),
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_title_rating_bin",
              fetchParams,
            ),
          ],
        );

      if (!role) return;

      setData((prev) => {
        const safePrev = prev ?? {};

        return {
          ...safePrev,
          [use_data]: {
            ...(safePrev[use_data] ?? {}),
            [role]: {
              ...(safePrev[use_data]?.[role] ?? {}),
              region_data,
              language_data,
              title_rating_bin_data,
            },
          },
        };
      });
    };

    run();
  }, [
    attributesLoading,
    company_id,
    genre,
    year,
    type,
    use_data,
    role,
  ]);

  useEffect(() => {
    const run = async () => {
      if (attributesLoading || !company_id || role !== "marketing") {
        console.log("Skipping fetch - not ready");
        return;
      }

      setLoading(true);

      const fetchParams = {
        number,
        sort_by: sort_by[use_data],
        region: region[use_data],
        year: year[use_data],
        title_type: type[use_data],
        genre: genre[use_data],
      };

      console.log("Fetching with params:", fetchParams);

      const [region_data] = await Promise.all(
        [
          fetchData(
            0,
            "company_region_rating",
            fetchParams,
          ),
        ],
      );

      setData((prev) => {
        const safePrev = prev ?? {};

        return {
          ...safePrev,
          all_company: {
            ...(safePrev?.all_company ?? {}),
            [role]: {
              ...(safePrev?.all_company?.[role] ?? {}),
              region_data,
            },
          },
        };
      });
    };

    run();
  }, [
    attributesLoading,
    company_id,
    genre,
    year,
    type,
    role,
  ]);

  useEffect(() => {
    const run = async () => {
      if (attributesLoading || !company_id || role !== "executive") {
        console.log("Skipping fetch - not ready");
        return;
      }

      setLoading(true);

      const fetchParams = {
        number,
        sort_by: sort_by[use_data],
        region: region[use_data],
        year: year[use_data],
        title_type: type[use_data],
        genre: genre[use_data],
      };

      console.log("Fetching with params:", fetchParams);

      const [
        genre_data,
        title_success_data,
        company_yearly_performance_data,
        total_production,
        average_rating,
      ] = await Promise
        .all(
          [
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_genre_rating",
              fetchParams,
              "executive",
            ),
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_title_success",
              fetchParams,
              "executive",
            ),
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_yearly_performance",
              fetchParams,
              "executive",
            ),
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_total_production",
              fetchParams,
              "executive",
            ),
            fetchData(
              is_current_company ? Number(company_id) : 0,
              "company_average_rating",
              fetchParams,
              "executive",
            ),
          ],
        );

      if (!role) return;

      setData((prev) => {
        const safePrev = prev ?? {};

        return {
          ...safePrev,
          [use_data]: {
            ...(safePrev[use_data] ?? {}),
            [role]: {
              ...(safePrev[use_data]?.[role] ?? {}),
              genre_data,
              title_success_data,
              company_yearly_performance_data,
              total_production,
              average_rating,
            },
          },
        };
      });
    };

    run();
  }, [
    attributesLoading,
    company_id,
    genre,
    region,
    year,
    type,
    use_data,
    role,
  ]);

  useEffect(() => {
    const run = async () => {
      if (attributesLoading || !company_id || role !== "executive") {
        console.log("Skipping fetch - not ready");
        return;
      }

      setLoading(true);

      const fetchParams = {
        number,
        sort_by: sort_by[use_data],
        region: region[use_data],
        year: year[use_data],
        title_type: type[use_data],
        genre: genre[use_data],
      };

      console.log("Fetching with params:", fetchParams);

      const [top_companies_rating_data, top_companies_production_data] =
        await Promise.all(
          [
            fetchData(
              0,
              "top_companies_rating_rate_count",
              fetchParams,
              "executive",
            ),
            fetchData(
              0,
              "top_companies_production",
              fetchParams,
              "executive",
            ),
          ],
        );

      setData((prev) => {
        const safePrev = prev ?? {};

        return {
          ...safePrev,
          all_company: {
            ...(safePrev?.all_company ?? {}),
            [role]: {
              ...(safePrev?.all_company?.[role] ?? {}),
              top_companies_production_data,
              top_companies_rating_data,
            },
          },
        };
      });
    };

    run();
  }, [
    attributesLoading,
    company_id,
    genre,
    year,
    type,
    use_data,
    role,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || attributesLoading) {
    return (
      <div className="p-10 text-center text-white bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        Loading Empire Data...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans text-white bg-[#0a0a0a]">
      {/* MANTRA HITAM MUTLAK */}
      <style jsx global>
        {`
        html, body {
          background-color: #0a0a0a !important;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        /* FIX SPACE KOSONG DI ATAS PAGE */
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background: #0a0a0a;
          z-index: -1;
        }
      `}
      </style>

      <div className="relative z-10 pt-15 px-6 pb-20 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
              {companyDetails?.company_name ?? null}{" "}
              <span className="text-[#ff3b3b]">Studios</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              Real-time performance analytics for{" "}
              <span className="text-white font-bold">
                {role === "executive"
                  ? "Strategic Decisions"
                  : "Market Expansion"}
              </span>.
            </p>
          </div>

          {/* ROLE SWITCHER TOGGLE */}
          <div className="bg-[#1a1a1a] p-1.5 rounded-xl border border-white/10 flex">
            <button
              onClick={() => setIsCurrentCompany(false)}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                !is_current_company
                  ? "bg-[#ff3b3b] text-white shadow-lg shadow-red-900/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setIsCurrentCompany(true)}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                is_current_company
                  ? "bg-[#0ea5e9] text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Company
            </button>
          </div>
          <div className="bg-[#1a1a1a] p-1.5 rounded-xl border border-white/10 flex">
            <button
              onClick={() => setRole("executive")}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                role === "executive"
                  ? "bg-[#ff3b3b] text-white shadow-lg shadow-red-900/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setRole("marketing")}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                role === "marketing"
                  ? "bg-[#0ea5e9] text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Marketing
            </button>
          </div>
        </div>

        {/* GLOBAL FILTERS TOOLBAR */}
        <div className="bg-[#121212] border border-white/5 p-4 rounded-xl mb-10 flex flex-wrap gap-4 items-center shadow-2xl relative z-40">
          <div className="flex items-center gap-2 text-[#ff3b3b] font-bold uppercase text-xs tracking-widest mr-4 border-r border-white/10 pr-6 h-8">
            <Filter size={16} /> Filters
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10">
            <span className="text-xs text-gray-500 uppercase font-bold">
              Genre
            </span>
            <select
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
              value={genre?.[use_data] || null}
              onChange={(e) =>
                setGenre({
                  ...genre,
                  [use_data]: e.target.value === ""
                    ? null
                    : e.target.value || null,
                })}
            >
              <option value="" className="text-black">All Genres</option>
              {attributes?.[use_data]?.genres?.map?.((g) => (
                <option
                  key={g}
                  value={g}
                  className="text-blue"
                >
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10">
            <span className="text-xs text-gray-500 uppercase font-bold">
              Year
            </span>
            <select
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
              value={year?.[use_data] || null}
              onChange={(e) =>
                setYear({ ...year, [use_data]: e.target.value || null })}
            >
              <option value={0} className="text-black">All Time</option>
              {attributes?.[use_data]?.years?.map?.((g) => (
                <option
                  key={g}
                  value={g}
                  className="text-blue"
                >
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`${
              role === "marketing" ? "hidden" : "flex"
            } items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10`}
          >
            <span className="text-xs text-gray-500 uppercase font-bold">
              Region
            </span>
            <select
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
              value={region?.[use_data] || null}
              onChange={(e) =>
                setRegion({
                  ...region,
                  [use_data]:
                    e.target.value === "" || e.target.value === "Global"
                      ? null
                      : e.target.value || null,
                })}
            >
              <option value={null} className="text-black">Global</option>
              {attributes?.[use_data]?.regions?.map?.((g) => (
                <option
                  key={g.region_code}
                  value={g.region_code}
                  className="text-blue"
                >
                  {g.region_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10">
            <span className="text-xs text-gray-500 uppercase font-bold">
              Type
            </span>
            <select
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
              value={type?.[use_data] || null}
              onChange={(e) =>
                setType({ ...type, [use_data]: e.target.value || null })}
            >
              <option value={null} className="text-black">All Types</option>
              {attributes?.[use_data]?.types?.map((g: string) => (
                <option
                  key={g}
                  value={g}
                  className="text-blue"
                >
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DYNAMIC CONTENT */}
        {role === "executive"
          ? (
            <ExecutiveView
              data={data?.[use_data]?.[role]}
              global_data={data?.all_company?.[role]}
              company_details={companyDetails}
              is_current_company={is_current_company}
            />
          )
          : (
            <MarketingView
              data={data?.[use_data]?.[role]}
              global_data={data?.all_company?.[role]}
              company_details={companyDetails}
              is_current_company={is_current_company}
            />
          )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-bold">
          Loading Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
