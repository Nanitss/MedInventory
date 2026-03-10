import { useState, useEffect } from 'react';
import { Button } from './primitives';
import { X, Search, RotateCcw } from 'lucide-react';

export interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: string[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Record<string, string>) => void;
    onReset: () => void;
    fields: FilterField[];
    currentFilters: Record<string, string>;
}

export const FilterModal = ({ isOpen, onClose, onApply, onReset, fields, currentFilters }: Props) => {
    const [filters, setFilters] = useState<Record<string, string>>(currentFilters);

    // Sync local state if parent state changes
    useEffect(() => {
        setFilters(currentFilters);
    }, [currentFilters, isOpen]);

    if (!isOpen) return null;

    const handleApply = () => {
        // filter out empty values
        const cleanFilters = Object.entries(filters).reduce((acc, [k, v]) => {
            if (v.trim() !== '') {
                acc[k] = v;
            }
            return acc;
        }, {} as Record<string, string>);

        onApply(cleanFilters);
        onClose();
    };

    const handleReset = () => {
        setFilters({});
        onReset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Search size={18} className="text-slate-500" />
                        Filter Records
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {fields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    value={filters[field.key] || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm bg-white"
                                >
                                    <option value="">All</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={filters[field.key] || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    placeholder={`Filter by ${field.label.toLowerCase()}...`}
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm"
                                />
                            )}
                        </div>
                    ))}

                    <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto text-slate-500 flex items-center justify-center gap-2">
                            <RotateCcw size={14} /> Reset
                        </Button>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                            <Button type="button" variant="primary" onClick={handleApply} className="w-full sm:w-auto">Apply Filter</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
