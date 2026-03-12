
import { useAppContext } from '../../lib/context';
import { Card } from '../ui/primitives';
import { format } from 'date-fns';
import { Activity, Thermometer, Droplets } from 'lucide-react';

export const MedicalRecords = () => {
    const { medicalRecords } = useAppContext();

    // Sort descending by date
    const sortedRecords = [...medicalRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-yellow-100 rounded-lg text-brand-yellow-dark">
                    <Activity size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Your Medical History</h3>
                    <p className="text-sm text-slate-500">Recent vitals and health check records</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRecords.map((record) => (
                    <Card key={record.id} className="p-5 border-t-4 border-t-brand-blue hover:shadow-xl transition-shadow bg-white">
                        <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-3">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                {format(new Date(record.date), 'MMM dd, yyyy')}
                            </span>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                                    <Thermometer size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Temperature</p>
                                    <p className="text-lg font-extrabold text-slate-700 tracking-tight">
                                        {record.temperature != null ? `${record.temperature}°C` : '--'}
                                        {record.temperature != null && record.temperature > 37.5 && <span className="ml-2 text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Elevated</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-sm">
                                    <Droplets size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Blood Pressure</p>
                                    <p className="text-lg font-extrabold text-slate-700 tracking-tight">
                                        {record.systolic != null && record.diastolic != null ? (
                                            <>{record.systolic} / {record.diastolic} <span className="text-[11px] text-slate-400 font-bold tracking-widest ml-1">mmHg</span></>
                                        ) : '--'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {sortedRecords.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        No medical records found.
                    </div>
                )}
            </div>
        </div>
    );
};
