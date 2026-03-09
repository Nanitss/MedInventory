import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button } from '../ui/primitives';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AddMedicineModal = ({ isOpen, onClose }: Props) => {
    const { addMedicine } = useAppContext();
    const [formData, setFormData] = useState({
        scientificName: '',
        brand: '',
        milligrams: '',
        expiryDate: '',
        illness: '',
        quantity: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedicine({
            scientificName: formData.scientificName,
            brand: formData.brand,
            milligrams: Number(formData.milligrams),
            expiryDate: new Date(formData.expiryDate).toISOString(),
            illness: formData.illness,
            quantity: Number(formData.quantity)
        });
        setFormData({
            scientificName: '',
            brand: '',
            milligrams: '',
            expiryDate: '',
            illness: '',
            quantity: ''
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
                    <h3 className="font-bold text-brand-blue-900 text-lg">Add New Medicine</h3>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Scientific Name</label>
                        <input
                            required
                            name="scientificName"
                            value={formData.scientificName}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                            placeholder="e.g. Paracetamol"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Brand Name</label>
                            <input
                                required
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                                placeholder="e.g. Biogesic"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Milligrams (mg)</label>
                            <input
                                required
                                type="number"
                                name="milligrams"
                                value={formData.milligrams}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                                placeholder="e.g. 500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Illness / Use</label>
                        <input
                            required
                            name="illness"
                            value={formData.illness}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                            placeholder="e.g. Pain relief, Fever"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
                            <input
                                required
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
                            <input
                                required
                                type="number"
                                min="1"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                                placeholder="e.g. 100"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add to Inventory</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
