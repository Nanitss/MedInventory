import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card } from '../ui/primitives';
import { format } from 'date-fns';
import { PlusCircle, Thermometer, Droplets } from 'lucide-react';
import { AddMedicalRecordModal } from './AddMedicalRecordModal';

export const EmployeeRecordsTab = () => {
    const { medicalRecords } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sort newest first
    const sortedRecords = [...medicalRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Employee Records</h3>
                    <p className="text-sm text-slate-500">Manage employee health vitals and medical history</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-brand-blue hover:bg-brand-blue-dark">
                    <PlusCircle size={18} />
                    Add Record
                </Button>
            </div>

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-4 px-6 font-semibold">Date</th>
                                <th className="py-4 px-6 font-semibold">Employee Name</th>
                                <th className="py-4 px-6 font-semibold">Temperature</th>
                                <th className="py-4 px-6 font-semibold">Blood Pressure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500">
                                        No medical records found
                                    </td>
                                </tr>
                            ) : (
                                sortedRecords.map((record) => (
                                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 text-slate-600 text-sm font-medium">
                                            {format(new Date(record.date), 'MMM dd, yyyy h:mm a')}
                                        </td>
                                        <td className="py-3 px-6 font-semibold text-slate-800">
                                            {record.employeeName}
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-2">
                                                <Thermometer size={16} className={record.temperature > 37.5 ? 'text-red-500' : 'text-slate-400'} />
                                                <span className={`font-medium ${record.temperature > 37.5 ? 'text-red-600' : 'text-slate-700'}`}>
                                                    {record.temperature}°C
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-2">
                                                <Droplets size={16} className="text-slate-400" />
                                                <span className="font-medium text-slate-700">
                                                    {record.systolic} / {record.diastolic} <span className="text-xs text-slate-400">mmHg</span>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddMedicalRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
