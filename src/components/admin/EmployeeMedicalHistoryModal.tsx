import { useAppContext } from '../../lib/context';
import { Button } from '../ui/primitives';
import { X, Activity, Droplets, Thermometer, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Employee } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

export const EmployeeMedicalHistoryModal = ({ isOpen, onClose, employee }: Props) => {
    const { medicalRecords } = useAppContext();

    if (!isOpen || !employee) return null;

    // Filter records for this employee, sorted newest first
    const history = medicalRecords
        .filter(r => r.employeeName.toLowerCase() === employee.name.toLowerCase())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="font-bold text-brand-blue-900 text-lg">{employee.name}'s Medical History</h3>
                        <p className="text-sm text-brand-blue-700">Detailed medical records and vitals</p>
                    </div>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No medical records found for this employee.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {history.map(record => (
                                <div key={record.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
                                        <div className="font-semibold text-slate-800">
                                            {format(new Date(record.date), 'MMMM dd, yyyy - h:mm a')}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                                            <div className="flex items-center gap-1.5 text-orange-600 mb-1">
                                                <Thermometer size={14} />
                                                <span className="text-xs font-semibold">Temperature</span>
                                            </div>
                                            <div className="text-lg font-bold text-orange-900">{record.temperature}°C</div>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                            <div className="flex items-center gap-1.5 text-red-600 mb-1">
                                                <Droplets size={14} />
                                                <span className="text-xs font-semibold">Blood Pressure</span>
                                            </div>
                                            <div className="text-lg font-bold text-red-900">{record.systolic}/{record.diastolic}</div>
                                        </div>
                                        <div className="bg-sky-50 rounded-lg p-3 border border-sky-100">
                                            <div className="flex items-center gap-1.5 text-sky-600 mb-1">
                                                <Activity size={14} />
                                                <span className="text-xs font-semibold">Pulse Rate</span>
                                            </div>
                                            <div className="text-lg font-bold text-sky-900">{record.pulseRate || '--'} bpm</div>
                                        </div>
                                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 flex flex-col justify-center">
                                            <div className="text-xs font-semibold text-emerald-600 mb-1">Medicine Given</div>
                                            <div className="text-sm font-medium text-emerald-900 truncate" title={record.medicineGiven}>
                                                {record.medicineGiven || 'None'}
                                            </div>
                                        </div>
                                    </div>

                                    {record.remarks && (
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <div className="text-xs font-semibold text-slate-500 mb-1">Remarks / Symptoms</div>
                                            <p className="text-sm text-slate-700">{record.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 border-t border-slate-200 flex justify-end shrink-0">
                    <Button type="button" variant="primary" onClick={onClose}>Close History</Button>
                </div>
            </div>
        </div>
    );
};
