import { MedicalRecords } from '../components/employee/MedicalRecords';
import { EmployeeRequestsHistory } from '../components/employee/EmployeeRequestsHistory';
import { Button } from '../components/ui/primitives';
import { Pill } from 'lucide-react';
import { useAppContext } from '../lib/context';

export const EmployeeDashboard = () => {
    const { requests, openModal } = useAppContext();

    // Pending requests for current employee "Juan Dela Cruz"
    const pendingRequests = requests.filter(r => r.employeeName === 'Juan Dela Cruz' && r.status === 'Pending');

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight text-brand-blue-dark">Employee Portal</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Juan Dela Cruz &middot; View medical history and request medicines</p>
                </div>
                <div className="flex items-center gap-4">
                    {pendingRequests.length > 0 && (
                        <span className="text-sm text-brand-yellow-dark font-semibold bg-brand-yellow-50 px-3 py-1 rounded-full border border-brand-yellow-100">
                            {pendingRequests.length} Pending Request(s)
                        </span>
                    )}
                    <Button
                        variant="primary"
                        onClick={() => openModal('REQUEST_MEDICINE')}
                        className="gap-2 shadow-md hover:shadow-lg transition-shadow bg-brand-blue hover:bg-brand-blue-dark"
                    >
                        <Pill size={18} />
                        Request Medicine
                    </Button>
                </div>
            </div>

            <div className="mt-8 space-y-8">
                <MedicalRecords />
                <hr className="border-slate-200" />
                <EmployeeRequestsHistory />
            </div>
        </div>
    );
};
