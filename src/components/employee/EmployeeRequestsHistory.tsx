import { useAppContext } from '../../lib/context';
import { Card, Badge } from '../ui/primitives';
import { format } from 'date-fns';
import { ClipboardList, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const EmployeeRequestsHistory = () => {
    const { requests } = useAppContext();

    // Filter requests for the current mocked employee and sort newest first
    const employeeRequests = requests
        .filter(r => r.employeeName === 'Juan Dela Cruz')
        .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

    return (
        <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-blue-50 rounded-lg text-brand-blue">
                    <ClipboardList size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Your Medicine Requests</h3>
                    <p className="text-sm text-slate-500">History of your past medicine requests and their status</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {employeeRequests.map((req) => (
                    <Card key={req.id} className="p-5 border-l-4 hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-brand-blue">
                        <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-lg">{req.items.map((i: any) => `${i.quantity}x ${i.medicineName}`).join(', ')}</h4>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                <Clock size={14} />
                                {format(new Date(req.requestDate), 'MMM dd, yyyy h:mm a')}
                            </p>
                            {req.reason && (
                                <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded border border-slate-100">
                                    "{req.reason}"
                                </p>
                            )}
                        </div>
                        <div className="flex items-center">
                            {req.status === 'Pending' && (
                                <Badge variant="warning" className="flex items-center gap-1">
                                    <Clock size={14} /> Pending
                                </Badge>
                            )}
                            {req.status === 'Approved' && (
                                <Badge variant="success" className="flex items-center gap-1">
                                    <CheckCircle2 size={14} /> Approved
                                </Badge>
                            )}
                            {req.status === 'Rejected' && (
                                <Badge variant="error" className="flex items-center gap-1">
                                    <XCircle size={14} /> Rejected
                                </Badge>
                            )}
                        </div>
                    </Card>
                ))}
                {employeeRequests.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        No medicine requests found.
                    </div>
                )}
            </div>
        </div >
    );
};
