import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button } from '../ui/primitives';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AddAdminRequestModal = ({ isOpen, onClose }: Props) => {
    const { addManualApprovedRequest, inventory, requests } = useAppContext();
    const [employeeName, setEmployeeName] = useState('');
    const [medicineRequested, setMedicineRequested] = useState('');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    // Get unique medicine names from inventory
    const uniqueMedicines = Array.from(new Set(inventory.map(b => b.scientificName))).sort();

    // Auto-suggest employee names directly from existing requests
    const uniqueEmployees = Array.from(new Set(requests.map(r => r.employeeName))).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        if (!employeeName.trim() || !medicineRequested) {
            alert('Please fill out all required fields.');
            return;
        }

        addManualApprovedRequest({
            employeeName: employeeName.trim(),
            medicineRequested,
            reason: reason.trim()
        });

        // Reset and close
        setEmployeeName('');
        setMedicineRequested('');
        setReason('');
        onClose();
    };

    // Check if the selected medicine has any stock left
    let stockRemaining = 0;
    if (medicineRequested) {
        stockRemaining = inventory
            .filter(b => b.scientificName.toLowerCase() === medicineRequested.toLowerCase())
            .reduce((acc, curr) => acc + curr.quantity, 0);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue-900 text-lg">Add Manual Request</h3>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 mb-4">
                        Requests added here are automatically marked as "Approved" and will deduct stock immediately if available.
                    </p>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                        <input
                            type="text"
                            list="employee-names"
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            placeholder="Type or select name..."
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm"
                            required
                        />
                        <datalist id="employee-names">
                            {uniqueEmployees.map(name => (
                                <option key={name} value={name} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Requested</label>
                        <select
                            value={medicineRequested}
                            onChange={(e) => setMedicineRequested(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm bg-white"
                            required
                        >
                            <option value="">Select Medicine...</option>
                            {uniqueMedicines.map(med => (
                                <option key={med} value={med}>{med}</option>
                            ))}
                        </select>
                        {medicineRequested && (
                            <p className={`text-xs mt-1 font-medium ${stockRemaining > 0 ? 'text-emerald-600' : 'text-red-500 flex items-center gap-1'}`}>
                                {stockRemaining > 0 ? `In Stock: ${stockRemaining} available` : <><AlertTriangle size={12} />Out of Stock. Request will be approved but no stock will be deducted.</>}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Symptoms (Optional)</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm min-h-[80px]"
                            placeholder="e.g. Headache, Fever..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Approved Request</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
