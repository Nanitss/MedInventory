import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { format } from 'date-fns';
import { Check, X, FileDown, Filter, PlusCircle, Edit3 } from 'lucide-react';
import { FilterModal, type FilterField } from '../ui/FilterModal';
import { exportToPdf } from '../../utils/exportPdf';

export const RequestsTab = () => {
    const { requests, approveRequest, rejectRequest, inventory, openModal } = useAppContext();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const uniqueNames = Array.from(new Set(requests.map(r => r.employeeName))).sort();

    const filterFields: FilterField[] = [
        { key: 'requestMonth', label: 'Request Month', type: 'month' },
        { key: 'employeeName', label: 'Employee Name', type: 'select', options: uniqueNames },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'] }
    ];

    // Sort requests: Pending first, then by date (newest first)
    const sortedRequests = [...requests]
        .filter(req => {
            const matchMonth = !filters.requestMonth || req.requestDate.startsWith(filters.requestMonth);
            const matchName = !filters.employeeName || req.employeeName === filters.employeeName;
            const matchStatus = !filters.status || req.status === filters.status;

            return matchMonth && matchName && matchStatus;
        })
        .sort((a, b) => {
            if (a.status === 'Pending' && b.status !== 'Pending') return -1;
            if (a.status !== 'Pending' && b.status === 'Pending') return 1;
            return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
        });

    const handleExportPdf = () => {
        const headers = ['Employee Name', 'Items Requested', 'Reason / Symptoms', 'Request Date', 'Status'];
        const data = sortedRequests.map(req => [
            req.employeeName,
            req.items ? req.items.map((i: any) => `${i.quantity}x ${i.medicineName}`).join(', ') : '',
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
                    <h3 className="text-lg font-bold text-slate-800">Employee Medicine</h3>
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
                    <Button onClick={() => openModal('ADD_ADMIN_REQUEST')} className="gap-2 bg-brand-blue hover:bg-brand-blue-dark w-full sm:w-auto">
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
                                    const outOfStock = req.items && req.items.some(item => {
                                        const available = inventory.filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase()).reduce((a, b) => a + b.quantity, 0);
                                        return available < item.quantity;
                                    }) && req.status === 'Pending';

                                    return (
                                        <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-6 font-semibold text-slate-800">
                                                {req.employeeName}
                                            </td>
                                            <td className="py-3 px-6 text-brand-blue-900 font-medium tracking-wide">
                                                <div className="space-y-1">
                                                    {req.items?.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-brand-blue-100 last:border-0 pb-1 last:pb-0">
                                                            <span>{item.quantity}x {item.medicineName}</span>
                                                        </div>
                                                    )) || ''}
                                                    {outOfStock && <span className="text-[10px] text-red-500 font-normal bg-red-50 px-2 py-0.5 rounded-full border border-red-100 mt-1 inline-block">Insufficient Stock</span>}
                                                </div>
                                                {req.reason && (
                                                    <div className="mt-2 text-xs text-slate-500 font-normal italic border-l-2 border-brand-blue-200 pl-2">
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
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => openModal('EDIT_REQUEST', req)} className="h-8 px-2 text-brand-blue hover:bg-brand-blue-50" title="Edit Request"><Edit3 size={16} /></Button>
                                                    {req.status === 'Pending' && (
                                                        <div className="flex items-center justify-end gap-1">
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
                                                    )}
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
