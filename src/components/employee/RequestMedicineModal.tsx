import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button } from '../ui/primitives';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const RequestMedicineModal = ({ isOpen, onClose }: Props) => {
    const { inventory, addRequest } = useAppContext();
    const [selectedIllness, setSelectedIllness] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    // Get unique illnesses from available inventory
    const availableIllnesses = Array.from(new Set(
        inventory
            .filter(med => med.quantity > 0 && med.illness)
            .map(med => med.illness)
            // Splitting comma separated illnesses into individual ones
            .flatMap(illness => illness.split(',').map(i => i.trim()))
    )).sort();

    // Get unique available medicines filtered by selected illness
    const availableMedicines = Array.from(new Set(
        inventory
            .filter(med => med.quantity > 0)
            .filter(med => !selectedIllness || med.illness.toLowerCase().includes(selectedIllness.toLowerCase()))
            .map(med => med.scientificName)
    )).sort();

    const handleIllnessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIllness(e.target.value);
        setSelectedMedicine(''); // Reset medicine selection when illness changes
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedicine) return;

        addRequest({
            employeeName: 'Juan Dela Cruz', // Mocked currently logged in employee
            medicineRequested: selectedMedicine,
            reason: reason,
        });

        setSelectedIllness('');
        setSelectedMedicine('');
        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue-900 text-lg">Request Medicine</h3>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Type of Illness</label>
                        <select
                            value={selectedIllness}
                            onChange={handleIllnessChange}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm mb-4"
                        >
                            <option value="">-- All Illnesses --</option>
                            {availableIllnesses.map(illness => (
                                <option key={illness} value={illness}>{illness}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Available Medicines</label>
                        <select
                            required
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm"
                        >
                            <option value="" disabled>-- Select a medicine --</option>
                            {availableMedicines.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        {availableMedicines.length === 0 && (
                            <p className="text-xs text-red-500 mt-2 font-medium">No medicines currently available for the selected illness.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Reason / Symptoms</label>
                        <textarea
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm resize-none"
                            placeholder="Please briefly describe what you are feeling and why you need this medicine..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!selectedMedicine || !reason.trim() || availableMedicines.length === 0}
                        >
                            Submit Request
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
