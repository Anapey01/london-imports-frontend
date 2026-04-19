'use client';

import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

interface PerformanceChartProps {
    data: {
        day: string;
        value: number;
    }[];
    isDark: boolean;
}

export default function PerformanceChart({ data, isDark }: PerformanceChartProps) {
    return (
        <div className={`p-8 rounded-[2.5rem] border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-primary-surface shadow-sm'
        }`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-nuclear-text'}`}>Revenue Velocity</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Daily transactional volume</p>
                </div>
                <div className="flex gap-2">
                    {['7D', '30D', 'ALL'].map((p) => (
                        <button 
                            key={p}
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                p === '7D' 
                                ? 'bg-emerald-600 text-white' 
                                : `border border-primary-surface ${isDark ? 'text-slate-400' : 'text-nuclear-text'} hover:bg-primary-surface/40`
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            vertical={false} 
                            stroke={isDark ? '#1e293b' : '#f1f5f9'} 
                        />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? '#475569' : '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 900, fill: isDark ? '#475569' : '#94a3b8' }}
                            tickFormatter={(val) => `₵${val}`}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '1rem', 
                                border: 'none', 
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                fontSize: '10px',
                                fontWeight: 900
                            }}
                            cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
