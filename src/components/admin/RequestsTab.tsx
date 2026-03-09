
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

export const RequestsTab = () => {
    const { requests, approveRequest, rejectRequest, inventory } = useAppContext();

    // Sort requests: Pending first, then by date (newest first)
    const sortedRequests = [...requests].sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    });

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800">Employee Requests</h3>
                <p className="text-sm text-slate-500">Review and manage medicine requests from employees</p>
            </div>

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-4 px-6 font-semibold">Employee Name</th>
                                <th className="py-4 px-6 font-semibold">Medicine Requested</th>
                                <th className="py-4 px-6 font-semibold">Request Date</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
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
        </div>
    );
};
