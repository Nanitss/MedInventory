import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card } from '../ui/primitives';
import { format } from 'date-fns';
import { PlusCircle, Thermometer, Droplets, Activity, FileText, FileDown, Filter } from 'lucide-react';
import { AddMedicalRecordModal } from './AddMedicalRecordModal';
import { ViewRemarksModal } from './ViewRemarksModal';
import { FilterModal, type FilterField } from '../ui/FilterModal';
import { exportToPdf } from '../../utils/exportPdf';
import type { MedicalRecord } from '../../types';

export const EmployeeRecordsTab = () => {
    const { medicalRecords } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const filterFields: FilterField[] = [
        { key: 'employeeName', label: 'Employee Name', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'text' },
        { key: 'medicineGiven', label: 'Medicine Given', type: 'text' }
    ];

    // Sort newest first
    const sortedRecords = [...medicalRecords]
        .filter(record => {
            const matchName = !filters.employeeName || record.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase());
            const matchRemarks = !filters.remarks || (record.remarks && record.remarks.toLowerCase().includes(filters.remarks.toLowerCase()));
            const matchMed = !filters.medicineGiven || (record.medicineGiven && record.medicineGiven.toLowerCase().includes(filters.medicineGiven.toLowerCase()));

            return matchName && matchRemarks && matchMed;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleExportPdf = () => {
        const headers = ['Date', 'Employee Name', 'Temp (°C)', 'BP (mmHg)', 'Pulse Rate', 'Remarks', 'Medicine Given'];
        const data = sortedRecords.map(rec => [
            format(new Date(rec.date), 'MMM dd, yyyy h:mm a'),
            rec.employeeName,
            rec.temperature.toString(),
            `${rec.systolic}/${rec.diastolic}`,
            rec.pulseRate || '--',
            rec.remarks || 'None',
            rec.medicineGiven || 'None'
        ]);

        exportToPdf({
            title: 'Employee Medical Records Report',
            headers,
            data,
            filename: 'medical_records_report'
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Employee Records</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500">Manage employee health vitals and medical history</p>
                        {Object.keys(filters).length > 0 && (
                            <div className="bg-slate-800 text-white text-[10px] py-0 px-2 rounded-full font-normal">
                                {Object.keys(filters).length} Filter(s) Applied
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="gap-2 w-full sm:w-auto text-slate-600">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button variant="outline" onClick={handleExportPdf} className="gap-2 w-full sm:w-auto text-slate-600">
                        <FileDown size={16} /> Export PDF
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-brand-blue hover:bg-brand-blue-dark w-full sm:w-auto">
                        <PlusCircle size={18} />
                        Add Record
                    </Button>
                </div>
            </div>

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Employee Name</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Temperature</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Blood Pressure</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Pulse Rate</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-center">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
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
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-2">
                                                <Activity size={16} className="text-slate-400" />
                                                <span className="font-medium text-slate-700">
                                                    {record.pulseRate || '--'} <span className="text-xs text-slate-400">bpm</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-brand-blue border border-brand-blue-200 hover:bg-brand-blue-50"
                                                onClick={() => setSelectedRecord(record)}
                                            >
                                                <FileText size={16} />
                                                <span className="ml-1 text-xs">View</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddMedicalRecordModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <ViewRemarksModal isOpen={selectedRecord !== null} onClose={() => setSelectedRecord(null)} record={selectedRecord} />
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(f) => setFilters(f)}
                onReset={() => setFilters({})}
                fields={filterFields}
                currentFilters={filters}
            />
        </div>
    );
};
