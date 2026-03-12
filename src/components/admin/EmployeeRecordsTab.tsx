import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card } from '../ui/primitives';
import { format, differenceInDays } from 'date-fns';
import { PlusCircle, Thermometer, Droplets, Activity, FileText, FileDown, Filter, Edit3, AlertCircle } from 'lucide-react';
import { FilterModal, type FilterField } from '../ui/FilterModal';
import { exportToPdf } from '../../utils/exportPdf';

export const EmployeeRecordsTab = () => {
    const { medicalRecords, openModal } = useAppContext();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const uniqueNames = Array.from(new Set(medicalRecords.map(r => r.employeeName))).sort();
    const uniqueMeds = Array.from(new Set(medicalRecords.map(r => r.medicineGiven).filter(Boolean) as string[])).sort();

    const filterFields: FilterField[] = [
        { key: 'recordMonth', label: 'Record Month', type: 'month' },
        { key: 'employeeName', label: 'Employee Name', type: 'select', options: uniqueNames },
        { key: 'tempRange', label: 'Temperature Range', type: 'select', options: ['Normal (≤ 37.5°C)', 'Fever (> 37.5°C)'] },
        { key: 'bpRange', label: 'Blood Pressure', type: 'select', options: ['Low / Hypotension', 'Normal', 'Elevated / Hypertension'] },
        { key: 'pulseRange', label: 'Pulse Rate', type: 'select', options: ['Low (< 60 bpm)', 'Normal (60-100 bpm)', 'High (> 100 bpm)'] },
        { key: 'medicineGiven', label: 'Medicine Given', type: 'select', options: uniqueMeds }
    ];

    // Calculate Employee Risks (3 high records in 7-day window)
    const analyzeEmployeeRisks = (records: any[]) => {
        const employeeRisks = new Map<string, { bp: boolean, temp: boolean, pulse: boolean }>();
        const recordsByEmp = records.reduce((acc: any, rec: any) => {
            if (!acc[rec.employeeName]) acc[rec.employeeName] = [];
            acc[rec.employeeName].push(rec);
            return acc;
        }, {});

        Object.entries(recordsByEmp).forEach(([name, empRecords]: [string, any]) => {
            let hasHighBp = false; let hasHighTemp = false; let hasHighPulse = false;
            const sorted = [...empRecords].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
            for (let i = 0; i < sorted.length; i++) {
                const currentRecDate = new Date(sorted[i].date);
                let bpCount = 0; let tempCount = 0; let pulseCount = 0;
                for (let j = i; j < sorted.length; j++) {
                    const checkedDate = new Date(sorted[j].date);
                    if (differenceInDays(checkedDate, currentRecDate) > 7) break;
                    if (sorted[j].systolic != null && sorted[j].diastolic != null && (sorted[j].systolic >= 140 || sorted[j].diastolic >= 90)) bpCount++;
                    if (sorted[j].temperature != null && sorted[j].temperature > 37.5) tempCount++;
                    const pulse = sorted[j].pulseRate ? parseInt(sorted[j].pulseRate, 10) : NaN;
                    if (!isNaN(pulse) && pulse > 100) pulseCount++;
                }
                if (bpCount >= 3) hasHighBp = true;
                if (tempCount >= 3) hasHighTemp = true;
                if (pulseCount >= 3) hasHighPulse = true;
                if (hasHighBp && hasHighTemp && hasHighPulse) break;
            }
            if (hasHighBp || hasHighTemp || hasHighPulse) {
                employeeRisks.set(name, { bp: hasHighBp, temp: hasHighTemp, pulse: hasHighPulse });
            }
        });
        return employeeRisks;
    };
    const risks = analyzeEmployeeRisks(medicalRecords);

    // Sort newest first
    const sortedRecords = [...medicalRecords]
        .filter(record => {
            const matchDate = !filters.recordMonth || record.date.startsWith(filters.recordMonth);
            const matchName = !filters.employeeName || record.employeeName === filters.employeeName;

            let matchTemp = true;
            if (filters.tempRange === 'Normal (≤ 37.5°C)') matchTemp = record.temperature != null && record.temperature <= 37.5;
            else if (filters.tempRange === 'Fever (> 37.5°C)') matchTemp = record.temperature != null && record.temperature > 37.5;

            let matchBp = true;
            if (filters.bpRange === 'Low / Hypotension') {
                matchBp = record.systolic != null && record.diastolic != null && (record.systolic < 90 || record.diastolic < 60);
            } else if (filters.bpRange === 'Normal') {
                matchBp = record.systolic != null && record.diastolic != null && ((record.systolic >= 90 && record.systolic <= 120) && (record.diastolic >= 60 && record.diastolic <= 80));
            } else if (filters.bpRange === 'Elevated / Hypertension') {
                matchBp = record.systolic != null && record.diastolic != null && (record.systolic > 120 || record.diastolic > 80);
            }

            let matchPulse = true;
            const pulse = record.pulseRate ? parseInt(record.pulseRate, 10) : NaN;
            if (!isNaN(pulse)) {
                if (filters.pulseRange === 'Low (< 60 bpm)') matchPulse = pulse < 60;
                else if (filters.pulseRange === 'Normal (60-100 bpm)') matchPulse = pulse >= 60 && pulse <= 100;
                else if (filters.pulseRange === 'High (> 100 bpm)') matchPulse = pulse > 100;
            } else if (filters.pulseRange) {
                // If filtering by pulse but value is missing, it doesn't match
                matchPulse = false;
            }

            const matchMed = !filters.medicineGiven || record.medicineGiven === filters.medicineGiven;

            return matchDate && matchName && matchTemp && matchBp && matchPulse && matchMed;
        })
        .sort((a, b) => {
            const aRisk = risks.has(a.employeeName);
            const bRisk = risks.has(b.employeeName);
            if (aRisk && !bRisk) return -1;
            if (!aRisk && bRisk) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    const handleExportPdf = () => {
        const headers = ['Date', 'Employee Name', 'Temp (°C)', 'BP (mmHg)', 'Pulse Rate', 'Remarks', 'Medicine Given'];
        const data = sortedRecords.map(rec => {
            const tempDisplay = rec.temperature != null ? `${rec.temperature}` : '--';
            const bpDisplay = rec.systolic != null && rec.diastolic != null ? `${rec.systolic}/${rec.diastolic}` : '--';
            
            // Helper to parsing medicine JSON just for export
            const getMedDisplay = (val: string) => {
                if (!val || val === 'None') return 'None';
                try {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed)) return parsed.map((i: any) => `${i.quantity}x ${i.medicineName}`).join(', ');
                } catch { /* legacy string */ }
                return val;
            };

            return [
                format(new Date(rec.date), 'MMM dd, yyyy h:mm a'),
                rec.employeeName,
                tempDisplay,
                bpDisplay,
                rec.pulseRate || '--',
                rec.remarks || 'None',
                getMedDisplay(rec.medicineGiven)
            ];
        });

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
                    <Button onClick={() => openModal('ADD_MEDICAL_RECORD')} className="gap-2 bg-brand-blue hover:bg-brand-blue-dark w-full sm:w-auto">
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
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-center">Actions</th>
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
                                sortedRecords.map((record) => {
                                    const riskInfo = risks.get(record.employeeName);
                                    let highlightClass = "text-slate-800";
                                    let tooltipText = "";

                                    if (riskInfo) {
                                        if (riskInfo.bp) { highlightClass = "text-red-600 font-bold"; tooltipText = "3+ High BP in a week"; }
                                        else if (riskInfo.temp) { highlightClass = "text-blue-600 font-bold"; tooltipText = "3+ High Temp in a week"; }
                                        else if (riskInfo.pulse) { highlightClass = "text-yellow-600 font-bold"; tooltipText = "3+ High Pulse in a week"; }
                                    }

                                    let bpColor = "text-slate-700";
                                    if (record.systolic != null && record.diastolic != null) {
                                        if (record.systolic >= 140 || record.diastolic >= 90) bpColor = "text-red-600";
                                        else if (record.systolic <= 90 || record.diastolic <= 60) bpColor = "text-blue-600";
                                    }

                                    return (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-6 text-slate-600 text-sm font-medium">
                                                {format(new Date(record.date), 'MMM dd, yyyy h:mm a')}
                                            </td>
                                            <td className="py-3 px-6 font-semibold" title={tooltipText}>
                                                <div className="flex items-center gap-1.5">
                                                    {riskInfo && <AlertCircle size={14} className={highlightClass} />}
                                                    <span className={`${highlightClass} flex-1`}>{record.employeeName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Thermometer size={16} className={record.temperature != null && record.temperature > 37.5 ? 'text-red-500' : 'text-slate-400'} />
                                                    <span className={`font-medium ${record.temperature != null && record.temperature > 37.5 ? 'text-red-600' : 'text-slate-700'}`}>
                                                        {record.temperature != null ? `${record.temperature}°C` : '--'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Droplets size={16} className={bpColor} />
                                                    <span className={`font-medium ${bpColor}`}>
                                                        {record.systolic != null && record.diastolic != null ? (
                                                            <>{record.systolic} / {record.diastolic} <span className="text-xs opacity-70">mmHg</span></>
                                                        ) : '--'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={16} className="text-slate-400" />
                                                    <span className="font-medium text-slate-700">
                                                        {record.pulseRate ? (
                                                            <>{record.pulseRate} <span className="text-xs text-slate-400">bpm</span></>
                                                        ) : '--'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-brand-blue hover:bg-brand-blue-50" onClick={() => openModal('VIEW_REMARKS', record)} title="View Remarks"><FileText size={16} /></Button>
                                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-brand-blue hover:bg-brand-blue-50" onClick={() => openModal('EDIT_MEDICAL_RECORD', record)} title="Edit Record"><Edit3 size={16} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

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
