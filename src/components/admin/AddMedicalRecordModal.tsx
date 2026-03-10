import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button } from '../ui/primitives';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AddMedicalRecordModal = ({ isOpen, onClose }: Props) => {
    const { addMedicalRecord } = useAppContext();
    const [formData, setFormData] = useState({
        employeeName: '',
        temperature: '',
        systolic: '',
        diastolic: '',
        pulseRate: '',
        remarks: '',
        medicineGiven: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedicalRecord({
            employeeName: formData.employeeName,
            temperature: Number(formData.temperature),
            systolic: Number(formData.systolic),
            diastolic: Number(formData.diastolic),
            pulseRate: formData.pulseRate,
            remarks: formData.remarks,
            medicineGiven: formData.medicineGiven
        });
        setFormData({
            employeeName: '',
            temperature: '',
            systolic: '',
            diastolic: '',
            pulseRate: '',
            remarks: '',
            medicineGiven: ''
        });
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue-900 text-lg">Add Medical Record</h3>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                        <input
                            required
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                            placeholder="e.g. Juan Dela Cruz"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Temperature (°C)</label>
                            <input
                                required
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                                placeholder="e.g. 36.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Pulse Rate (bpm)</label>
                            <input
                                required
                                type="number"
                                name="pulseRate"
                                value={formData.pulseRate}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                                placeholder="e.g. 75"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Systolic (mmHg)</label>
                            <input
                                required
                                type="number"
                                name="systolic"
                                value={formData.systolic}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                                placeholder="e.g. 120"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Diastolic (mmHg)</label>
                            <input
                                required
                                type="number"
                                name="diastolic"
                                value={formData.diastolic}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                                placeholder="e.g. 80"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Remarks / Symptoms</label>
                            <textarea
                                required
                                name="remarks"
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all resize-none h-full"
                                placeholder="..."
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Given</label>
                            <textarea
                                required
                                name="medicineGiven"
                                value={formData.medicineGiven}
                                onChange={(e) => setFormData({ ...formData, medicineGiven: e.target.value })}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all resize-none h-full"
                                placeholder="e.g. Paracetamol"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Record</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
