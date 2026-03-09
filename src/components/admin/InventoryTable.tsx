import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { AddMedicineModal } from './AddMedicineModal.tsx';

export const InventoryTable = () => {
    const { inventory } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sorting Logic: Expiring soon (<= 30 days) on top, then by oldest added
    const sortedInventory = [...inventory].sort((a, b) => {
        const isAExpiring = differenceInDays(new Date(a.expiryDate), new Date()) <= 30;
        const isBExpiring = differenceInDays(new Date(b.expiryDate), new Date()) <= 30;

        if (isAExpiring && !isBExpiring) return -1;
        if (!isAExpiring && isBExpiring) return 1;

        return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
    });

    const expiringCount = inventory.filter(m => differenceInDays(new Date(m.expiryDate), new Date()) <= 30).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Current Stock</h3>
                    <p className="text-sm text-slate-500">View and manage the medicine inventory</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto">
                    <PlusCircle size={18} />
                    Add Medicine
                </Button>
            </div>

            {expiringCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start gap-4 animate-in fade-in duration-300">
                    <AlertTriangle className="text-red-500 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-red-800">Warning: Expiring Medicines</h4>
                        <p className="text-sm text-red-600 font-medium">
                            There are {expiringCount} medicines expiring within 30 days or already expired. They have been moved to the top of the table.
                        </p>
                    </div>
                </div>
            )}

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Scientific Name</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Brand</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Details</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Illness/Use</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Added Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Expiry Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-right">Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedInventory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        No medicines in inventory
                                    </td>
                                </tr>
                            ) : (
                                sortedInventory.map((med) => {
                                    const daysToExpiry = differenceInDays(new Date(med.expiryDate), new Date());
                                    const isExpiringSoon = daysToExpiry <= 30;
                                    const isExpired = daysToExpiry < 0;

                                    return (
                                        <tr
                                            key={med.id}
                                            className={`border-b border-slate-100 transition-colors ${isExpired ? 'bg-red-50/50 hover:bg-red-50' :
                                                isExpiringSoon ? 'bg-brand-yellow-50/50 hover:bg-brand-yellow-50' :
                                                    'hover:bg-slate-50'
                                                }`}
                                        >
                                            <td className="py-3 px-6 font-semibold text-slate-800">
                                                {med.scientificName}
                                            </td>
                                            <td className="py-3 px-6 text-slate-600">{med.brand}</td>
                                            <td className="py-3 px-6">
                                                <Badge variant="default">{med.milligrams} mg</Badge>
                                            </td>
                                            <td className="py-3 px-6 text-slate-600">{med.illness}</td>
                                            <td className="py-3 px-6 text-slate-600 text-sm">
                                                {format(new Date(med.addedDate), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-brand-yellow-dark' : 'text-slate-600'}`}>
                                                        {format(new Date(med.expiryDate), 'MMM dd, yyyy')}
                                                    </span>
                                                    {isExpired ? (
                                                        <Badge variant="error" className="text-[10px] px-1.5 py-0">Expired</Badge>
                                                    ) : isExpiringSoon ? (
                                                        <Badge variant="warning" className="text-[10px] px-1.5 py-0">Expiring</Badge>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-right font-bold text-slate-800 text-lg">
                                                {med.quantity}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddMedicineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
