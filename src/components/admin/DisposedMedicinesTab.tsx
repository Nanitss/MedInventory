import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { FileDown, Filter, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { exportToPdf } from '../../utils/exportPdf';
import { FilterModal, type FilterField } from '../ui/FilterModal';

export const DisposedMedicinesTab = () => {
    const { disposedMedicines } = useAppContext();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const uniqueNames = Array.from(new Set(disposedMedicines.map(m => m.scientificName))).sort();
    const uniqueBrands = Array.from(new Set(disposedMedicines.map(m => m.brand))).sort();

    const filterFields: FilterField[] = [
        { key: 'disposeMonth', label: 'Disposed Month', type: 'month' },
        { key: 'scientificName', label: 'Generic Name', type: 'select', options: uniqueNames },
        { key: 'brand', label: 'Brand Name', type: 'select', options: uniqueBrands }
    ];

    const sortedDisposed = [...disposedMedicines]
        .filter(med => {
            const matchMonth = !filters.disposeMonth || med.disposedDate.startsWith(filters.disposeMonth);
            const matchName = !filters.scientificName || med.scientificName === filters.scientificName;
            const matchBrand = !filters.brand || med.brand === filters.brand;
            return matchMonth && matchName && matchBrand;
        })
        .sort((a, b) => new Date(b.disposedDate).getTime() - new Date(a.disposedDate).getTime());

    const handleExportPdf = () => {
        const headers = ['Generic Name', 'Brand', 'Exp Date', 'Disposed Date', 'Qty', 'Reason'];
        const data = sortedDisposed.map(med => [
            med.scientificName,
            med.brand,
            format(new Date(med.expiryDate), 'MMM yyyy'),
            format(new Date(med.disposedDate), 'MMM dd, yyyy h:mm a'),
            med.quantity.toString(),
            'Expired'
        ]);

        exportToPdf({
            title: 'Disposed Medicines Report',
            headers,
            data,
            filename: 'disposed_medicines_report'
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Trash2 size={20} className="text-red-500" /> Disposed Medicines</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500">Record of expired and disposed medicines</p>
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
                </div>
            </div>

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Generic Name</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Brand</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Added Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Expiry Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Disposed Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-right">Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDisposed.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No disposed medicines found
                                    </td>
                                </tr>
                            ) : (
                                sortedDisposed.map((med) => (
                                    <tr key={med.id} className="border-b border-slate-100 hover:bg-red-50/50 transition-colors">
                                        <td className="py-3 px-6 font-semibold text-slate-800">
                                            {med.scientificName}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm">
                                            {med.brand}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm">
                                            {format(new Date(med.addedDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm">
                                            <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                {format(new Date(med.expiryDate), 'MMM yyyy')}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 font-medium text-slate-700">
                                            {format(new Date(med.disposedDate), 'MMM dd, yyyy h:mm a')}
                                        </td>
                                        <td className="py-3 px-6 text-right font-bold text-slate-800 text-lg">
                                            {med.quantity}
                                        </td>
                                    </tr>
                                ))
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
