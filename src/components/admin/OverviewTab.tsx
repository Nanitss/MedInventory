import { useState, useMemo } from 'react';
import { useAppContext } from '../../lib/context';
import { Card } from '../ui/primitives';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, Cell
} from 'recharts';
import { format, parseISO, startOfMonth, subMonths, isSameMonth } from 'date-fns';

export const OverviewTab = () => {
    const { inventory, requests, medicalRecords } = useAppContext();

    // Setup for Month-over-Month Comparison
    const [monthA, setMonthA] = useState<Date>(startOfMonth(new Date()));
    const [monthB, setMonthB] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));

    // Generate recent months for the dropdown (last 12 months)
    const recentMonths = Array.from({ length: 12 }, (_, i) => startOfMonth(subMonths(new Date(), i)));

    // Process data for the Comparison Chart
    const comparisonData = useMemo(() => {
        const getStatsForMonth = (date: Date) => {
            const monthlyConsults = medicalRecords.filter(r => isSameMonth(new Date(r.date), date));
            const monthlyRequests = requests.filter(r => isSameMonth(new Date(r.requestDate), date));
            return {
                name: format(date, 'MMM yyyy'),
                Consultations: monthlyConsults.length,
                'Medicine Requests': monthlyRequests.length
            };
        };
        return [getStatsForMonth(monthB), getStatsForMonth(monthA)];
    }, [medicalRecords, requests, monthA, monthB]);

    // Process data for Inventory Chart (Top 10 Lowest Stock items that are actually used)
    const inventoryChartData = useMemo(() => {
        return [...inventory]
            .sort((a, b) => a.quantity - b.quantity)
            .slice(0, 10)
            .map(med => ({
                name: med.scientificName,
                Quantity: med.quantity,
                brand: med.brand
            }));
    }, [inventory]);

    // Process data for System Trend (Last 6 Months Area Chart)
    const trendData = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => {
            const date = startOfMonth(subMonths(new Date(), 5 - i));
            return {
                month: format(date, 'MMM yy'),
                Consultations: medicalRecords.filter(r => isSameMonth(new Date(r.date), date)).length,
                Requests: requests.filter(r => isSameMonth(new Date(r.requestDate), date)).length
            };
        });
    }, [medicalRecords, requests]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-bold text-slate-800">Analytics Dashboard</h3>
                <p className="text-sm text-slate-500">Overview of medical activity and inventory status</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Month over Month Comparison */}
                <Card className="p-5 flex flex-col shadow-sm border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h4 className="font-bold text-slate-700">Month-over-Month Comparison</h4>
                        <div className="flex items-center gap-2">
                            <select
                                className="text-sm border border-slate-300 rounded-md py-1.5 px-2 bg-white text-slate-700 shadow-sm focus:ring-brand-blue"
                                value={monthB.toISOString()}
                                onChange={e => setMonthB(parseISO(e.target.value))}
                            >
                                {recentMonths.map(d => (
                                    <option key={`b-${d.toISOString()}`} value={d.toISOString()}>
                                        {format(d, 'MMM yyyy')}
                                    </option>
                                ))}
                            </select>
                            <span className="text-slate-400 text-sm font-medium">vs</span>
                            <select
                                className="text-sm border border-slate-300 rounded-md py-1.5 px-2 bg-white text-brand-blue-900 font-semibold shadow-sm focus:ring-brand-blue"
                                value={monthA.toISOString()}
                                onChange={e => setMonthA(parseISO(e.target.value))}
                            >
                                {recentMonths.map(d => (
                                    <option key={`a-${d.toISOString()}`} value={d.toISOString()}>
                                        {format(d, 'MMM yyyy')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Consultations" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                <Bar dataKey="Medicine Requests" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Chart 2: Inventory Status */}
                <Card className="p-5 flex flex-col shadow-sm border-slate-200">
                    <div className="mb-6">
                        <h4 className="font-bold text-slate-700">Lowest Stock Inventory</h4>
                        <p className="text-xs text-slate-500 mt-1">Top 10 items requiring restock</p>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inventoryChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    formatter={(value: any, name: any, props: any) => [value, props?.payload?.brand ? `${name} (${props.payload.brand})` : name]}
                                />
                                <Bar dataKey="Quantity" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={20}>
                                    {
                                        inventoryChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.Quantity <= 20 ? '#ef4444' : entry.Quantity <= 50 ? '#f59e0b' : '#14b8a6'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Chart 3: System Wide Activity Trend */}
                <Card className="p-5 flex flex-col shadow-sm border-slate-200 lg:col-span-2">
                    <div className="mb-6">
                        <h4 className="font-bold text-slate-700">Activity Trend (Last 6 Months)</h4>
                        <p className="text-xs text-slate-500 mt-1">Overall system usage over time</p>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorConsults" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="Consultations" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorConsults)" />
                                <Area type="monotone" dataKey="Requests" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorReqs)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
