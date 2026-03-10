import { useState, useEffect } from 'react';
import { Button } from './primitives';
import { X, Search, RotateCcw } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onApply: (query: string) => void;
    onReset: () => void;
    currentQuery: string;
}

export const FilterModal = ({ isOpen, onClose, onApply, onReset, currentQuery }: Props) => {
    const [query, setQuery] = useState(currentQuery);

    // Sync local state if parent state changes
    useEffect(() => {
        setQuery(currentQuery);
    }, [currentQuery, isOpen]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply(query);
        onClose();
    };

    const handleReset = () => {
        setQuery('');
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

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Search Query</label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type to filter..."
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-sm"
                            autoFocus
                        />
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
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
