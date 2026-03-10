import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { format } from 'date-fns';
import { Check, X, FileDown, Filter, PlusCircle } from 'lucide-react';
import { FilterModal, type FilterField } from '../ui/FilterModal';
import { AddAdminRequestModal } from './AddAdminRequestModal';
import { exportToPdf } from '../../utils/exportPdf';

export const RequestsTab = () => {
    const { requests, approveRequest, rejectRequest, inventory } = useAppContext();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const filterFields: FilterField[] = [
        { key: 'employeeName', label: 'Employee Name', type: 'text' },
        { key: 'medicine', label: 'Medicine Requested', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'] }
    ];

    // Sort requests: Pending first, then by date (newest first)
    const sortedRequests = [...requests]
        .filter(req => {
            const matchName = !filters.employeeName || req.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase());
            const matchMed = !filters.medicine || req.medicineRequested.toLowerCase().includes(filters.medicine.toLowerCase());
            const matchStatus = !filters.status || req.status.toLowerCase() === filters.status.toLowerCase();

            return matchName && matchMed && matchStatus;
        })
        .sort((a, b) => {
            if (a.status === 'Pending' && b.status !== 'Pending') return -1;
            if (a.status !== 'Pending' && b.status === 'Pending') return 1;
            return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
        });

    const handleExportPdf = () => {
        const headers = ['Employee Name', 'Medicine Requested', 'Reason / Symptoms', 'Request Date', 'Status'];
        const data = sortedRequests.map(req => [
            req.employeeName,
            req.medicineRequested,
            req.reason || 'N/A',
            format(new Date(req.requestDate), 'MMM dd, yyyy h:mm a'),
            req.status
        ]);

        exportToPdf({
            title: 'Employee Medicine Requests Report',
            headers,
            data,
            filename: 'requests_report'
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Employee Requests</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500">Review and manage medicine requests from employees</p>
                        {Object.keys(filters).length > 0 && (
                            <Badge variant="default" className="font-normal text-[10px] py-0 px-2 rounded-full">
                                {Object.keys(filters).length} Filter(s) Applied
                            </Badge>
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
                        Add Request
                    </Button>
                </div>
            </div>

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Employee Name</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Medicine Requested</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Request Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Status</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        No requests found
                                    </td>
                                </tr>
                            ) : (
                                sortedRequests.map((req) => {
                                    // Check stock availability
                                    const totalStock = inventory
                                        .filter(b => b.scientificName.toLowerCase() === req.medicineRequested.toLowerCase())
                                        .reduce((acc, curr) => acc + curr.quantity, 0);

                                    const outOfStock = totalStock === 0 && req.status === 'Pending';

                                    return (
                                        <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-6 font-semibold text-slate-800">
                                                {req.employeeName}
                                            </td>
                                            <td className="py-3 px-6 text-brand-blue-900 font-medium tracking-wide">
                                                <div>
                                                    {req.medicineRequested}
                                                    {outOfStock && <span className="ml-2 text-xs text-red-500 font-normal bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Out of Stock</span>}
                                                </div>
                                                {req.reason && (
                                                    <div className="mt-1 text-xs text-slate-500 font-normal italic border-l-2 border-brand-blue-200 pl-2">
                                                        "{req.reason}"
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-slate-600 text-sm">
                                                {format(new Date(req.requestDate), 'MMM dd, yyyy h:mm a')}
                                            </td>
                                            <td className="py-3 px-6">
                                                {req.status === 'Pending' && <Badge variant="warning">Pending</Badge>}
                                                {req.status === 'Approved' && <Badge variant="success">Approved</Badge>}
                                                {req.status === 'Rejected' && <Badge variant="error">Rejected</Badge>}
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                {req.status === 'Pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                                            onClick={() => rejectRequest(req.id)}
                                                        >
                                                            <X size={18} />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3"
                                                            disabled={outOfStock}
                                                            onClick={() => approveRequest(req.id)}
                                                        >
                                                            <Check size={16} className="mr-1.5" />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400 italic">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddAdminRequestModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
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
