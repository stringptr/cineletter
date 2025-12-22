"use client";

import { notFound } from "next/navigation";
import { useSearchParams, useParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
// Import Recharts
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar, ScatterChart, Scatter, ZAxis, LineChart, Line, ComposedChart,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
// Import Icons
import { 
  Building2, Star, Users, LayoutGrid, Film, Calendar, 
  Users as UsersIcon, DollarSign, Menu, X, 
  Activity, TrendingUp, PlayCircle, Globe, Tv, Crown, Flame, Clock, AlertCircle, Heart, UserCheck, Video, Award, MapPin, Languages, Radar as RadarIcon, Hourglass, ShieldAlert, Baby, PieChart as PieIcon, BarChart as BarChartIcon
} from "lucide-react";
import {z} from "zod"
import { titleCompleteSchema } from "@/schemas/title/base.ts";
import { movieVsTvUnifiedArray } from "../../../../../schemas/title/agregate.ts";

// --- KONSTANTA WARNA ---
const COLOR_MOVIE = "#8b5cf6"; // Ungu
const COLOR_TV    = "#1e90ff"; // Biru
const COLORS_GENRE = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

// ==========================================
// DATA DUMMY
// ==========================================
const kpiStats = { moviesCount: "8,200", tvCount: "4,250", brandRating: "8.4", engagement: "2.8B" };
const productionTrendData = [
  { year: '2019', movies: 30, tv: 15 }, { year: '2020', movies: 20, tv: 12 }, 
  { year: '2021', movies: 35, tv: 23 }, { year: '2022', movies: 45, tv: 29 },
  { year: '2023', movies: 50, tv: 32 }, { year: '2024', movies: 55, tv: 40 },
];

const recentReleases = [
  { id: 1, title: "Moana 2", year: "2024", popularity: "Trending", popScore: 98, type: "Movie" },
  { id: 2, title: "Mufasa", year: "2024", popularity: "High", popScore: 85, type: "Movie" },
  { id: 3, title: "Inside Out 2", year: "2024", popularity: "Blockbuster", popScore: 92, type: "Movie" },
  { id: 4, title: "Agatha All Along", year: "2024", popularity: "Rising", popScore: 74, type: "TV Show" },
  { id: 5, title: "Elio", year: "2025", popularity: "Anticipated", popScore: 65, type: "Movie" },
];

// Genre Data
const genreKPI = { 
    dominant: "Action Adventure", 
    dominantValue: "35% of Total", 
    highestRated: "Documentary", 
    highestRatedValue: "8.8/10",   
    mostViral: "Animation", 
    mostViralValue: "1.2B Views"   
};
const genreLandscapeData = [
  { name: 'Action', count: 120, rating: 7.2 }, { name: 'Drama', count: 98, rating: 8.1 },
  { name: 'Comedy', count: 86, rating: 6.9 }, { name: 'Horror', count: 65, rating: 5.8 },
  { name: 'Sci-Fi', count: 45, rating: 7.8 }, { name: 'Docu', count: 30, rating: 8.8 },
];
const genreMatrixData = [
  { genre: 'Action', x: 120, y: 7.2, z: 200 }, { genre: 'Drama', x: 98, y: 8.1, z: 150 },
  { genre: 'Comedy', x: 86, y: 6.9, z: 100 }, { genre: 'Horror', x: 65, y: 5.8, z: 80 },
  { genre: 'Sci-Fi', x: 45, y: 7.8, z: 120 }, { genre: 'Animation', x: 110, y: 8.5, z: 250 },
  { genre: 'Romance', x: 40, y: 6.5, z: 50 },
];
const genreEvolutionData = [
  { year: '2020', action: 30, drama: 40, comedy: 20, horror: 10 },
  { year: '2021', action: 35, drama: 35, comedy: 25, horror: 15 },
  { year: '2022', action: 45, drama: 30, comedy: 15, horror: 20 },
  { year: '2023', action: 50, drama: 25, comedy: 15, horror: 25 },
  { year: '2024', action: 60, drama: 20, comedy: 10, horror: 30 },
];
const topVolumeGenreRatingTrend = [
  { year: '2020', Action: 6.8, Drama: 7.9, Comedy: 6.5, Horror: 5.5, SciFi: 7.2 },
  { year: '2021', Action: 7.0, Drama: 8.0, Comedy: 6.7, Horror: 5.8, SciFi: 7.5 },
  { year: '2022', Action: 7.4, Drama: 7.8, Comedy: 6.4, Horror: 6.2, SciFi: 7.3 }, 
  { year: '2023', Action: 7.2, Drama: 7.6, Comedy: 6.8, Horror: 6.5, SciFi: 7.9 }, 
  { year: '2024', Action: 7.5, Drama: 7.5, Comedy: 7.0, Horror: 5.9, SciFi: 8.2 }, 
];

// Year Data
const yearKPI = { golden: "2016", peak: "2022", current: "7.9" };
const qualityTimelineData = [
  { year: '2018', rating: 7.2, popularity: 45 }, { year: '2019', rating: 7.8, popularity: 60 }, 
  { year: '2020', rating: 6.5, popularity: 30 }, { year: '2021', rating: 7.0, popularity: 55 },
  { year: '2022', rating: 7.5, popularity: 75 }, { year: '2023', rating: 7.2, popularity: 65 },
  { year: '2024', rating: 7.9, popularity: 88 },
];
const runtimeData = [
  { year: '2018', minutes: 110 }, { year: '2019', minutes: 125 }, { year: '2020', minutes: 105 }, 
  { year: '2021', minutes: 118 }, { year: '2022', minutes: 132 }, { year: '2023', minutes: 128 },
  { year: '2024', minutes: 135 },
];
const statusData = [
  { year: '2020', released: 20, canceled: 5, ended: 2 }, { year: '2021', released: 35, canceled: 3, ended: 5 },
  { year: '2022', released: 45, canceled: 2, ended: 8 }, { year: '2023', released: 40, canceled: 8, ended: 10 },
  { year: '2024', released: 50, canceled: 1, ended: 4 },
];

// Talent Data
const talentKPI = { mostUsed: "Samuel L. Jackson", topDirectorName: "Pete Docter", topDirectorRating: "9.2", retention: "340 Crew" };
const topCollaboratorsData = [
    { name: 'Michael Giacchino', count: 18, role: 'Composer' }, { name: 'Samuel L. Jackson', count: 15, role: 'Actor' },
    { name: 'Kevin Feige', count: 14, role: 'Producer' }, { name: 'Alan Menken', count: 12, role: 'Composer' },
    { name: 'Frank Welker', count: 10, role: 'Voice Actor' }, { name: 'Robert Downey Jr.', count: 9, role: 'Actor' },
    { name: 'Jon Favreau', count: 8, role: 'Director' },
];
const directorSuccessData = [
    { name: 'Russo Brothers', count: 4, rating: 8.5 }, { name: 'Jon Favreau', count: 6, rating: 7.8 },
    { name: 'Taika Waititi', count: 3, rating: 7.9 }, { name: 'J.J. Abrams', count: 5, rating: 7.0 },
    { name: 'Rob Marshall', count: 8, rating: 6.5 }, { name: 'Brad Bird', count: 2, rating: 8.2 },
    { name: 'Guy Ritchie', count: 2, rating: 7.2 },
];
const castImpactData = [
    { name: 'RDJ', rating: 8.0, popularity: 95, count: 10 }, { name: 'Chris Evans', rating: 7.8, popularity: 90, count: 9 },
    { name: 'Scarlett Johansson', rating: 7.5, popularity: 88, count: 8 }, { name: 'Chris Pratt', rating: 7.2, popularity: 85, count: 6 },
    { name: 'Tom Holland', rating: 7.9, popularity: 98, count: 5 }, { name: 'Dwayne Johnson', rating: 6.8, popularity: 92, count: 4 },
    { name: 'Emma Stone', rating: 7.6, popularity: 80, count: 3 },
];

// AKAs Data
const akasKPI = { effortScore: "12.5", topRegion: "France (FR)", retention: "65%" };
const regionData = [
    { name: 'France', code: 'FR', count: 450 }, { name: 'Japan', code: 'JP', count: 420 },
    { name: 'Germany', code: 'DE', count: 380 }, { name: 'Spain', code: 'ES', count: 350 },
    { name: 'Italy', code: 'IT', count: 310 }, { name: 'Brazil', code: 'BR', count: 290 },
    { name: 'Russia', code: 'RU', count: 250 },
];
const languageRadarData = [
    { subject: 'English', A: 120, fullMark: 150 }, { subject: 'French', A: 98, fullMark: 150 },
    { subject: 'Spanish', A: 86, fullMark: 150 }, { subject: 'Japanese', A: 99, fullMark: 150 },
    { subject: 'Chinese', A: 85, fullMark: 150 }, { subject: 'German', A: 65, fullMark: 150 },
];
const globalReachData = [
    { year: '2018', regions: 8 }, { year: '2019', regions: 10 }, { year: '2020', regions: 7 }, 
    { year: '2021', regions: 12 }, { year: '2022', regions: 15 }, { year: '2023', regions: 18 },
    { year: '2024', regions: 22 }, 
];

// Content Data
const contentKPI = { avgRuntimeMovie: "124 min", avgRuntimeSeries: "42 min", adultRatio: "2.4%" };
const runtimeDistData = [
    { range: '< 30m', count: 120 }, { range: '30-90m', count: 200 }, { range: '90-120m', count: 450 }, 
    { range: '120-150m', count: 300 }, { range: '> 150m', count: 80 },
];
const adultFamilyData = [
    { type: 'Family/General', rating: 7.8, popularity: 85 },
    { type: 'Adult (18+)', rating: 6.5, popularity: 92 },
];
const genreRuntimeData = [
    { genre: 'Biography', minutes: 135 }, { genre: 'Action', minutes: 128 }, { genre: 'Drama', minutes: 115 },
    { genre: 'Romance', minutes: 105 }, { genre: 'Comedy', minutes: 98 }, { genre: 'Horror', minutes: 92 },
    { genre: 'Animation', minutes: 88 },
];


function DashboardContent() {
  const params = useParams()
  const company_id = params.company_id as string
  const searchParams = useSearchParams();
  const [companyData, setCompanyData] = useState<z.infer<typeof movieVsTvUnifiedArray> | []>([])
  const [generalData, setGeneralData] = useState<z.infer<typeof movieVsTvUnifiedArray> | []>([])
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [activeView, setActiveView] = useState("overview"); 
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [companyRes, generalRes] = await Promise.all([
        fetch(`/api/company/${company_id}/marketing/overview`),
        fetch(`/api/company/0/marketing/overview`)
      ]);

      const companyJson = await companyRes.json();
      const generalJson = await generalRes.json();

      setCompanyData(companyJson);
      setGeneralData(generalJson);

    } catch (error: any) {
      if (error?.number === 50001) {
        notFound()
      }
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, [company_id]); // Re-run when company_id changes

  const companyValidMovieRating = 
  companyData?.filter(
    (row) => row.movie_avg_rating !== null && row.movie_avg_rating > 0
  );
  const companyValidTvRating = 
  companyData?.filter(
    (row) => row.tv_avg_rating !== null && row.tv_avg_rating > 0
  );

const movieSum =
  companyValidMovieRating?.reduce(
    (sum, row) => sum + row.movie_avg_rating!,
    0
  ) ?? 0;

const tvSum =
  companyValidTvRating?.reduce(
    (sum, row) => sum + row.tv_avg_rating!,
    0
  ) ?? 0;

const totalCount =
  (companyValidMovieRating?.length ?? 0) +
  (companyValidTvRating?.length ?? 0);

const overallAverageRating =
  totalCount > 0 ? (movieSum + tvSum) / totalCount : 0;
  const role = "Marketing";
  const themeColor =  "#1e90ff"; 
  const companyLabel = company_id;

const portfolioData = [{ name: 'Movie', value: 

  companyData?.reduce(
    (sum, row) => sum + row.movie_count!,
    0
  ) ?? 0
  }, { name: 'TV Show', value: 

  companyData?.reduce(
    (sum, row) => sum + row.tv_count!,
    0)
    }];

  const sidebarMenus = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "genre", label: "Genre Analysis", icon: Activity },
    { id: "year", label: "Yearly Archive", icon: Calendar },
    { id: "talent", label: "Talent & Crew", icon: UsersIcon },
    { id: "akas", label: "AKAs-Language", icon: Globe },
    { id: "content", label: "Content Details", icon: Film },
  ];

  if (!mounted) return <div className="p-10 text-center text-white">Loading Empire Data...</div>;

  // --- RENDER 1: OVERVIEW ---
  const renderOverview = () => (
    <div className="space-y-8 animate-fadeIn">
        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-900/20 text-purple-400"><Film className="w-5 h-5" /></div>
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Movies</span>
                        </div>
                        <span className="text-2xl font-black text-white">{companyData?.reduce((sum, row) => sum + row.movie_count, 0) ?? 0}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/5"></div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-900/20 text-blue-400"><Tv className="w-5 h-5" /></div>
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">TV Shows</span>
                        </div>
                        <span className="text-2xl font-black text-white">{companyData?.reduce((sum, row) => sum + row.tv_count, 0) ?? 0}</span>
                    </div>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-yellow-900/20 flex items-center justify-center border border-yellow-500/20">
                    <Star className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Global Brand Rating</p>
                    <h3 className="text-3xl font-black text-white mt-1">{overallAverageRating.toPrecision(3)}<span className="text-lg text-gray-500">/10</span></h3>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-green-900/20 flex items-center justify-center border border-green-500/20">
                    <Users className="w-7 h-7 text-green-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Total Engagement</p>
                    <h3 className="text-3xl font-black text-white mt-1">{companyData?.reduce((sum, row) => sum + row.movie_sum_rate_count + row.tv_sum_rate_count, 0) ?? 0}</h3>
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Production History</h3>
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={companyData}>
                                <defs>
                                    <linearGradient id="colorMovies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_MOVIE} stopOpacity={0.3}/><stop offset="95%" stopColor={COLOR_MOVIE} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorTV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_TV} stopOpacity={0.3}/><stop offset="95%" stopColor={COLOR_TV} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="year" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                <Legend verticalAlign="top" height={36} iconType="circle"/>
                                <Area dot={false} type="monotone" dataKey="movie_count" name="Movies" stroke={COLOR_MOVIE} fillOpacity={1} fill="url(#colorMovies)" strokeWidth={3} />
                                <Area dot={false} type="monotone" dataKey="tv_count" name="TV Shows" stroke={COLOR_TV} fillOpacity={1} fill="url(#colorTV)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Average Rating History</h3>
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={companyData}>
                                <defs>
                                    <linearGradient id="colorMovies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_MOVIE} stopOpacity={0.3}/><stop offset="95%" stopColor={COLOR_MOVIE} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorTV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_TV} stopOpacity={0.3}/><stop offset="95%" stopColor={COLOR_TV} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="year" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                <Legend verticalAlign="top" height={36} iconType="circle"/>
                                <Area dot={false} type="monotone" dataKey="movie_avg_rating" name="Movies" stroke={COLOR_MOVIE} fillOpacity={1} fill="url(#colorMovies)" strokeWidth={3} />
                                <Area dot={false} type="monotone" dataKey="tv_avg_rating" name="TV Shows" stroke={COLOR_TV} fillOpacity={1} fill="url(#colorTV)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Average Rate Count History</h3>
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={companyData}>
                                <defs>
                                    <linearGradient id="colorMovies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_MOVIE} stopOpacity={0.3}/><stop offset="95%" stopColor={COLOR_MOVIE} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorTV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_TV} stopOpacity={0.3}/><stop offset="95%" stopColor={COLOR_TV} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="year" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                <Legend verticalAlign="top" height={36} iconType="circle"/>
                                <Area dot={false} type="monotone" dataKey="movie_avg_rate_count" name="Movies" stroke={COLOR_MOVIE} fillOpacity={1} fill="url(#colorMovies)" strokeWidth={3} />
                                <Area dot={false} type="monotone" dataKey="tv_avg_rate_count" name="TV Shows" stroke={COLOR_TV} fillOpacity={1} fill="url(#colorTV)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">Portfolio Composition</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={portfolioData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                    <Cell fill={COLOR_MOVIE} /><Cell fill={COLOR_TV} />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-[#121212] h-full rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 bg-[#181818]">
                        <h3 className="font-bold flex items-center gap-2 text-white">
                            <PlayCircle className="w-5 h-5 text-green-400" /> Top 5 Recent
                        </h3>
                    </div>
                    <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                        {recentReleases.map((item) => (
                            <div key={item.id} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-gray-400">{item.year}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${item.type === 'Movie' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>{item.type}</span>
                                </div>
                                <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate mb-3">{item.title}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: `${item.popScore}%` }}></div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg font-black text-white leading-none">{item.popScore}</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Pop. Index</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // --- RENDER 2: GENRE ---
  const renderGenre = () => (
    <div className="space-y-8 animate-fadeIn">
         {/* KPI */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-orange-900/20 flex items-center justify-center border border-orange-500/20">
                    <Crown className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Dominant Genre</p>
                    <h3 className="text-2xl font-black text-white mt-1">{genreKPI.dominant}</h3>
                    <p className="text-xs text-orange-400 mt-1 font-bold">{genreKPI.dominantValue}</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-yellow-900/20 flex items-center justify-center border border-yellow-500/20">
                    <Star className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Highest Rated</p>
                    <h3 className="text-2xl font-black text-white mt-1">{genreKPI.highestRated}</h3>
                    <p className="text-xs text-yellow-400 mt-1 font-bold">{genreKPI.highestRatedValue}</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center border border-red-500/20">
                    <Flame className="w-7 h-7 text-red-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Most Viral</p>
                    <h3 className="text-2xl font-black text-white mt-1">{genreKPI.mostViral}</h3>
                    <p className="text-xs text-red-400 mt-1 font-bold">{genreKPI.mostViralValue}</p>
                </div>
            </div>
         </div>

         {/* Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Genre Performance Matrix</h3>
                        <p className="text-xs text-gray-500">Volume vs Rating</p>
                    </div>
                    <Activity className="w-5 h-5 text-gray-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis type="number" dataKey="x" name="Volume" stroke="#666" />
                            <YAxis type="number" dataKey="y" name="Rating" stroke="#666" domain={[0, 10]} />
                            <ZAxis type="number" dataKey="z" range={[60, 400]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-black border border-white/20 p-3 rounded-lg shadow-xl">
                                          <p className="font-bold text-white mb-1">{data.genre}</p>
                                          <p className="text-xs text-gray-400">Vol: <span className="text-white">{data.x}</span></p>
                                          <p className="text-xs text-gray-400">Rating: <span className="text-yellow-400">{data.y}</span></p>
                                        </div>
                                      );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter name="Genres" data={genreMatrixData} fill={themeColor}>
                                {genreMatrixData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_GENRE[index % COLORS_GENRE.length]} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="mb-6">
                     <h3 className="text-lg font-bold text-white">Genre Landscape</h3>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={genreLandscapeData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" stroke="#666" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} width={80} />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Bar dataKey="count" fill={themeColor} radius={[0, 4, 4, 0]} barSize={20}>
                                {genreLandscapeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.rating < 6 ? '#ef4444' : themeColor} /> 
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="mb-6">
                     <h3 className="text-lg font-bold text-white">Top 5 Genres: Rating Trend</h3>
                     <p className="text-xs text-gray-500">Quality evolution of high-volume genres</p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={topVolumeGenreRatingTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="year" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} domain={[5, 10]} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Line type="monotone" dataKey="Action" stroke="#8b5cf6" strokeWidth={2} dot={{r:3}} />
                            <Line type="monotone" dataKey="Drama" stroke="#0ea5e9" strokeWidth={2} dot={{r:3}} />
                            <Line type="monotone" dataKey="Comedy" stroke="#ec4899" strokeWidth={2} dot={{r:3}} />
                            <Line type="monotone" dataKey="SciFi" stroke="#2dd4bf" strokeWidth={2} dot={{r:3}} />
                            <Line type="monotone" dataKey="Horror" stroke="#f59e0b" strokeWidth={2} dot={{r:3}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
         </div>
    </div>
  );

  // --- RENDER 3: YEARLY ---
  const renderYear = () => (
    <div className="space-y-8 animate-fadeIn">
        
        {/* GRADIENTS */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id="runtimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="statusReleasedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="statusCanceledGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#be185d" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="statusEndedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="qualityRatingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="qualityPopGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
            </defs>
        </svg>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                    <Crown className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Golden Year</p>
                    <h3 className="text-3xl font-black text-white mt-1">{yearKPI.golden}</h3>
                    <p className="text-xs text-gray-500 mt-1">Best Avg Rating</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20">
                    <TrendingUp className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Peak Productivity</p>
                    <h3 className="text-3xl font-black text-white mt-1">{yearKPI.peak}</h3>
                    <p className="text-xs text-gray-500 mt-1">Highest Volume</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-green-900/20 flex items-center justify-center border border-green-500/20">
                    <Activity className="w-7 h-7 text-green-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Current Year Perf.</p>
                    <h3 className="text-3xl font-black text-white mt-1">{yearKPI.current}<span className="text-lg text-gray-500">/10</span></h3>
                    <p className="text-xs text-gray-500 mt-1">Avg Rating (YTD)</p>
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Quality Timeline</h3>
                        <p className="text-xs text-gray-500">Avg Rating vs Popularity over time</p>
                    </div>
                    <Star className="w-5 h-5 text-pink-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={qualityTimelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="year" stroke="#666" />
                            <YAxis yAxisId="left" stroke="#ec4899" domain={[0, 10]} label={{ value: 'Rating', angle: -90, position: 'insideLeft', fill: '#ec4899' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#0ea5e9" domain={[0, 100]} label={{ value: 'Popularity', angle: 90, position: 'insideRight', fill: '#0ea5e9' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="rating" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#qualityRatingGrad)" name="Avg Rating" />
                            <Area yAxisId="right" type="monotone" dataKey="popularity" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#qualityPopGrad)" name="Avg Popularity" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Runtime Trends</h3>
                        <p className="text-xs text-gray-500">Avg Duration (Minutes) per Year</p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-500" />
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={runtimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="year" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Bar dataKey="minutes" fill="url(#runtimeGradient)" radius={[4, 4, 0, 0]} name="Avg Minutes" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Status Breakdown</h3>
                        <p className="text-xs text-gray-500">Released vs Canceled vs Ended</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="year" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Legend />
                            {/* Blue */}
                            <Bar dataKey="released" stackId="a" fill="url(#statusReleasedGrad)" name="Released" />
                            {/* Pink */}
                            <Bar dataKey="canceled" stackId="a" fill="url(#statusCanceledGrad)" name="Canceled" />
                            {/* Purple */}
                            <Bar dataKey="ended" stackId="a" fill="url(#statusEndedGrad)" radius={[4, 4, 0, 0]} name="Ended" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );

  // --- RENDER 4: TALENT ---
  const renderTalent = () => (
    <div className="space-y-8 animate-fadeIn">
        
        {/* GRADIENT FOR TALENT */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id="talentGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
        </svg>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20">
                    <UserCheck className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Most Used Actor</p>
                    <h3 className="text-xl font-black text-white mt-1">{talentKPI.mostUsed}</h3>
                    <p className="text-xs text-gray-500 mt-1">Frequent Collaborator</p>
                </div>
            </div>
            {/* KPI: TOP DIRECTOR */}
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-pink-900/20 flex items-center justify-center border border-pink-500/20">
                    <Award className="w-7 h-7 text-pink-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Top Director</p>
                    <h3 className="text-2xl font-black text-white mt-1">{talentKPI.topDirectorName}</h3>
                    <p className="text-xs text-gray-500 mt-1">Avg Rating: <span className="text-pink-400 font-bold">{talentKPI.topDirectorRating}</span></p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                    <Heart className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Crew Retention</p>
                    <h3 className="text-3xl font-black text-white mt-1">{talentKPI.retention}</h3>
                    <p className="text-xs text-gray-500 mt-1">Returning Staff</p>
                </div>
            </div>
        </div>

        {/* CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Top Collaborators */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Top Collaborators</h3>
                        <p className="text-xs text-gray-500">Most frequent actors & crew</p>
                    </div>
                    <UsersIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCollaboratorsData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" stroke="#666" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} width={100} />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Bar dataKey="count" fill="url(#talentGradient)" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Director Success */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Director Success Rate</h3>
                        <p className="text-xs text-gray-500">Quantity vs Quality (Rating)</p>
                    </div>
                    <Video className="w-5 h-5 text-pink-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis type="number" dataKey="count" name="Movies" stroke="#666" label={{ value: 'Movies', position: 'insideBottomRight', offset: -5, fill: '#666' }} />
                            <YAxis type="number" dataKey="rating" name="Rating" stroke="#666" domain={[0, 10]} label={{ value: 'Rating', angle: -90, position: 'insideLeft', fill: '#666' }} />
                            <Tooltip content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-black border border-white/20 p-3 rounded-lg shadow-xl">
                                          <p className="font-bold text-white mb-1">{data.name}</p>
                                          <p className="text-xs text-gray-400">Movies: <span className="text-white">{data.count}</span></p>
                                          <p className="text-xs text-gray-400">Rating: <span className="text-pink-400">{data.rating}</span></p>
                                        </div>
                                      );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter name="Directors" data={directorSuccessData} fill="#ec4899">
                                {directorSuccessData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#ec4899" />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Cast Impact */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Cast Popularity Impact</h3>
                        <p className="text-xs text-gray-500">Rating vs Popularity (Size = Movie Count)</p>
                    </div>
                    <Star className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis type="number" dataKey="rating" name="Rating" stroke="#666" domain={[5, 10]} label={{ value: 'Avg Rating', position: 'insideBottom', offset: -5, fill: '#666' }} />
                            <YAxis type="number" dataKey="popularity" name="Popularity" stroke="#666" domain={[0, 100]} label={{ value: 'Avg Popularity', angle: -90, position: 'insideLeft', fill: '#666' }} />
                            <ZAxis type="number" dataKey="count" range={[100, 1000]} name="Movies" />
                            <Tooltip content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-black border border-white/20 p-3 rounded-lg shadow-xl">
                                          <p className="font-bold text-white mb-1">{data.name}</p>
                                          <p className="text-xs text-gray-400">Rating: <span className="text-white">{data.rating}</span></p>
                                          <p className="text-xs text-gray-400">Popularity: <span className="text-purple-400">{data.popularity}</span></p>
                                          <p className="text-xs text-gray-400">Movies: {data.count}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter name="Cast" data={castImpactData} fill="#8b5cf6" fillOpacity={0.7}>
                                {castImpactData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#8b5cf6" />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );

  // --- RENDER 5: AKAS (AKAS-LANGUAGE) ---
  const renderAKAs = () => (
    <div className="space-y-8 animate-fadeIn">
        
        {/* GRADIENTS */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id="globalReachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="barBluePurple" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
        </svg>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20">
                    <Globe className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Global Effort Score</p>
                    <h3 className="text-3xl font-black text-white mt-1">{akasKPI.effortScore}</h3>
                    <p className="text-xs text-gray-500 mt-1">Avg AKAs per Title</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-pink-900/20 flex items-center justify-center border border-pink-500/20">
                    <MapPin className="w-7 h-7 text-pink-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Top Target Region</p>
                    <h3 className="text-2xl font-black text-white mt-1">{akasKPI.topRegion}</h3>
                    <p className="text-xs text-gray-500 mt-1">Highest AKA Count</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                    <Languages className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Original Title Retention</p>
                    <h3 className="text-3xl font-black text-white mt-1">{akasKPI.retention}</h3>
                    <p className="text-xs text-gray-500 mt-1">Untranslated Titles</p>
                </div>
            </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Top Target Regions */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Top Target Regions</h3>
                        <p className="text-xs text-gray-500">Most localized markets (AKAs count)</p>
                    </div>
                    <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" stroke="#666" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} width={80} />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Bar dataKey="count" fill="url(#barBluePurple)" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Language Coverage (Radar) */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Language Coverage</h3>
                        <p className="text-xs text-gray-500">Localization depth by language</p>
                    </div>
                    <RadarIcon className="w-5 h-5 text-pink-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={languageRadarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Titles"
                                dataKey="A"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                fill="#8b5cf6"
                                fillOpacity={0.4}
                            />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Global Reach Trend (Area) */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Global Reach Trend</h3>
                        <p className="text-xs text-gray-500">Avg number of regions targeted per title (Yearly)</p>
                    </div>
                    <Globe className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={globalReachData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="year" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Area type="monotone" dataKey="regions" stroke="#ec4899" fillOpacity={1} fill="url(#globalReachGrad)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );

  // --- RENDER 6: CONTENT DETAILS ---
  const renderContentDetails = () => (
    <div className="space-y-8 animate-fadeIn">
        
        {/* GRADIENTS */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="genreRunGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
        </svg>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20">
                    <Clock className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Avg Runtime (Movies)</p>
                    <h3 className="text-3xl font-black text-white mt-1">{contentKPI.avgRuntimeMovie}</h3>
                    <p className="text-xs text-gray-500 mt-1">Typical Length</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                    <Tv className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Avg Runtime (Series)</p>
                    <h3 className="text-3xl font-black text-white mt-1">{contentKPI.avgRuntimeSeries}</h3>
                    <p className="text-xs text-gray-500 mt-1">Per Episode</p>
                </div>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-pink-900/20 flex items-center justify-center border border-pink-500/20">
                    <ShieldAlert className="w-7 h-7 text-pink-400" />
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Adult Content Ratio</p>
                    <h3 className="text-3xl font-black text-white mt-1">{contentKPI.adultRatio}</h3>
                    <p className="text-xs text-gray-500 mt-1">18+ Content</p>
                </div>
            </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Runtime Distribution (Histogram) */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Runtime Distribution</h3>
                        <p className="text-xs text-gray-500">Duration segments (Short vs Long)</p>
                    </div>
                    <Hourglass className="w-5 h-5 text-blue-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={runtimeDistData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="range" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Bar dataKey="count" fill="url(#distGradient)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Adult vs Family Performance */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Adult vs Family</h3>
                        <p className="text-xs text-gray-500">Rating & Popularity Comparison</p>
                    </div>
                    <Baby className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adultFamilyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="type" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="rating" name="Rating (Avg)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="popularity" name="Popularity (Avg)" fill="#ec4899" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Genre Runtime Average (Horizontal Bar) */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Genre Runtime Average</h3>
                        <p className="text-xs text-gray-500">Which genres demand the most time?</p>
                    </div>
                    <Clock className="w-5 h-5 text-pink-500" />
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={genreRuntimeData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" stroke="#666" />
                            <YAxis dataKey="genre" type="category" stroke="#fff" width={80} />
                            <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                            <Bar dataKey="minutes" fill="url(#genreRunGradient)" radius={[0, 4, 4, 0]} barSize={25} name="Avg Minutes" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden">
      
      {/* BACKGROUND UTAMA HITAM PEKAT */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-0" />

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#121212] border-r border-white/10 z-[60] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10 mt-16">
            <h2 className="font-bold text-lg tracking-wider text-white">DASHBOARD MENU</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-4 space-y-2">
            {sidebarMenus.map((menu) => (
                <button
                    key={menu.id}
                    onClick={() => { setActiveView(menu.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === menu.id ? "bg-white/5 text-white border border-white/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                    style={activeView === menu.id ? { color: themeColor, borderColor: themeColor, backgroundColor: `${themeColor}15` } : {}}
                >
                    <menu.icon className="w-5 h-5" />{menu.label}
                </button>
            ))}
        </div>
      </div>

      {/* MAIN CONTAINER (Padding Atas Dikurangi pt-16) */}
      <div className="relative z-10 pt-16 px-6 pb-20 max-w-7xl mx-auto text-white">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] px-4 py-2 rounded-lg border border-white/10 text-sm font-bold transition text-white"><Menu className="w-4 h-4" /> Filter By</button>
                    <span className="text-gray-500 text-sm">/ {sidebarMenus.find(m => m.id === activeView)?.label}</span>
                </div>
                <h1 className="text-3xl font-bold flex items-center gap-3">{companyLabel} <span className="text-gray-500 font-light">{sidebarMenus.find(m => m.id === activeView)?.label}</span></h1>
            </div>
            <div className={`px-4 py-2 rounded-full border border-white/10 bg-[#1a1a1a] text-sm font-semibold flex items-center gap-2`} style={{ color: themeColor }}>
                <Building2 className="w-4 h-4" />{role.toUpperCase()} ACCESS
            </div>
        </div>

        {/* LOGIC SWITCHING CONTENT */}
        {activeView === "overview" && renderOverview()}
        {activeView === "genre" && renderGenre()}
        {activeView === "year" && renderYear()}
        {activeView === "talent" && renderTalent()}
        {activeView === "akas" && renderAKAs()}
        {activeView === "content" && renderContentDetails()}
        
        {/* Fallback */}
        {activeView !== "overview" && activeView !== "genre" && activeView !== "year" && activeView !== "talent" && activeView !== "akas" && activeView !== "content" && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-xl font-bold">Data Module: {sidebarMenus.find(m => m.id === activeView)?.label}</p>
                <p className="text-sm mt-2">Connecting to secure server...</p>
            </div>
        )}

      </div>
    </div>
  );
}

export default function MarketingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-bold">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
