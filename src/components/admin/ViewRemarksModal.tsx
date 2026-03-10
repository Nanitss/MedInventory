import { Button } from '../ui/primitives';
import { X, FileText, Pill } from 'lucide-react';
import type { MedicalRecord } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    record: MedicalRecord | null;
}

export const ViewRemarksModal = ({ isOpen, onClose, record }: Props) => {
    if (!isOpen || !record) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue-900 text-lg">Record Details</h3>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 border-b border-slate-100 pb-2">
                            <FileText size={16} className="text-brand-blue" />
                            Remarks / Symptoms
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                            {record.remarks || "No remarks provided."}
                        </p>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 border-b border-slate-100 pb-2">
                            <Pill size={16} className="text-brand-blue" />
                            Medicine Given
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                            {record.medicineGiven || "No medicine given."}
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="button" variant="primary" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
