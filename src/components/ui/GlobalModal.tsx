import { useState, useEffect } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card } from './primitives';
import { X, Save, Edit3, User, AlertCircle, Phone, Droplets, HeartPulse, Activity, Thermometer, FileText, Pill, Plus, Trash2, FileDown } from 'lucide-react';
import { format } from 'date-fns';

export const GlobalModal = () => {
    const context = useAppContext();
    const { modalState, closeModal } = context;

    if (modalState.type === 'NONE') return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="my-8 w-full flex justify-center">
                <ModalBody type={modalState.type} data={modalState.data} onClose={closeModal} context={context} />
            </div>
        </div>
    );
};

const ModalBody = ({ type, data, onClose, context }: any) => {
    switch (type) {
        case 'ADD_EMPLOYEE': return <AddEmployeeBody onClose={onClose} addEmployee={context.addEmployee} />;
        case 'EDIT_EMPLOYEE': return <EditEmployeeBody onClose={onClose} editEmployee={context.editEmployee} data={data} />;
        case 'ADD_MEDICINE': return <AddMedicineBody onClose={onClose} addMedicine={context.addMedicine} />;
        case 'EDIT_MEDICINE': return <EditMedicineBody onClose={onClose} editMedicine={context.editMedicine} data={data} />;
        case 'DISPOSE_MEDICINE': return <DisposeMedicineBody onClose={onClose} disposeMedicine={context.disposeMedicine} data={data} />;
        case 'ADD_MEDICAL_RECORD': return <AddMedicalRecordBody onClose={onClose} addMedicalRecord={context.addMedicalRecord} inventory={context.inventory} employees={context.employees} />;
        case 'EDIT_MEDICAL_RECORD': return <EditMedicalRecordBody onClose={onClose} editMedicalRecord={context.editMedicalRecord} data={data} inventory={context.inventory} employees={context.employees} />;
        case 'ADD_ADMIN_REQUEST': return <AddAdminRequestBody onClose={onClose} addManualApprovedRequest={context.addManualApprovedRequest} inventory={context.inventory} employees={context.employees} />;
        case 'REQUEST_MEDICINE': return <RequestMedicineBody onClose={onClose} addRequest={context.addRequest} inventory={context.inventory} employees={context.employees} />;
        case 'EDIT_REQUEST': return <EditRequestBody onClose={onClose} editRequest={context.editRequest} data={data} />;
        case 'VIEW_MEDICAL_HISTORY': return <ViewMedicalHistoryBody onClose={onClose} employee={data} medicalRecords={context.medicalRecords} />;
        case 'VIEW_MEDICAL_INFO': return <ViewMedicalInfoBody onClose={onClose} employee={data} context={context} />;
        case 'VIEW_REMARKS': return <ViewRemarksBody onClose={onClose} record={data} />;
        case 'VIEW_GIVEN_MEDICINES': return <ViewGivenMedicinesBody onClose={onClose} employee={data} context={context} />;
        default: return null;
    }
};

/* --- ADD/EDIT EMPLOYEE --- */
const AddEmployeeBody = ({ onClose, addEmployee }: any) => {
    const [formData, setFormData] = useState({ name: '', contactNumber: '', address: '', gender: 'Male', age: '' });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEmployee({ ...formData, gender: formData.gender as 'Male' | 'Female' | 'Other', age: Number(formData.age) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-blue-900 text-lg">Add New Employee</h3>
                <button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. Maria Santos" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label><input required value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. 0917-123-4567" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Age</label><input required type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. 28" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1"><label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label><select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                    <div className="col-span-1"><label className="block text-sm font-semibold text-slate-700 mb-1">Address</label><input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="City, Province" /></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add Employee</Button></div>
            </form>
        </div>
    );
};

const EditEmployeeBody = ({ onClose, editEmployee, data }: any) => {
    const [formData, setFormData] = useState({ name: data.name, contactNumber: data.contactNumber, address: data.address, gender: data.gender, age: data.age });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editEmployee(data.id, { ...formData, age: Number(formData.age) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Edit Employee</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label><input required value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Age</label><input required type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1"><label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label><select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                    <div className="col-span-1"><label className="block text-sm font-semibold text-slate-700 mb-1">Address</label><input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save Changes</Button></div>
            </form>
        </div>
    );
};

/* --- ADD/EDIT/DISPOSE MEDICINE --- */
const AddMedicineBody = ({ onClose, addMedicine }: any) => {
    const [formData, setFormData] = useState({ scientificName: '', brand: '', milligrams: '', expiryDate: '', illness: '', quantity: '' });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedicine({ ...formData, milligrams: Number(formData.milligrams), expiryDate: new Date(formData.expiryDate).toISOString(), quantity: Number(formData.quantity) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Add New Medicine</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Generic Name</label><input required value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow" placeholder="e.g. Paracetamol" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Brand Name</label><input required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. Biogesic" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Milligrams (mg)</label><input required type="number" value={formData.milligrams} onChange={e => setFormData({ ...formData, milligrams: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. 500" /></div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Illness / Use</label><input required value={formData.illness} onChange={e => setFormData({ ...formData, illness: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. Pain relief, Fever" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label><input required type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label><input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. 100" /></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add to Inventory</Button></div>
            </form>
        </div>
    );
};

const EditMedicineBody = ({ onClose, editMedicine, data }: any) => {
    const [formData, setFormData] = useState({ scientificName: data.scientificName, brand: data.brand, milligrams: data.milligrams, expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '', illness: data.illness, quantity: data.quantity });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editMedicine(data.id, { ...formData, milligrams: Number(formData.milligrams), expiryDate: new Date(formData.expiryDate).toISOString(), quantity: Number(formData.quantity) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Edit Medicine</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Generic Name</label><input required value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Brand Name</label><input required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Milligrams (mg)</label><input required type="number" value={formData.milligrams} onChange={e => setFormData({ ...formData, milligrams: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Illness / Use</label><input required value={formData.illness} onChange={e => setFormData({ ...formData, illness: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label><input required type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label><input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save Changes</Button></div>
            </form>
        </div>
    );
};

const DisposeMedicineBody = ({ onClose, disposeMedicine, data }: any) => {
    const [qty, setQty] = useState(data.quantity);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        disposeMedicine(data.id, Number(qty));
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between"><h3 className="font-bold text-red-900 text-lg flex items-center gap-2"><Trash2 size={18} /> Dispose Medicine</h3><button type="button" onClick={onClose} className="text-red-500 hover:text-red-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-sm text-slate-600">You are about to dispose <strong>{data.scientificName} ({data.brand})</strong>. Please confirm the quantity to dispose.</p>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Quantity to Dispose</label><input required type="number" min="1" max={data.quantity} value={qty} onChange={e => setQty(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                <div className="pt-2 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" className="bg-red-600 hover:bg-red-700">Dispose</Button></div>
            </form>
        </div>
    );
};

/* --- ADD/EDIT MEDICAL RECORD --- */
const AddMedicalRecordBody = ({ onClose, addMedicalRecord, inventory, employees }: any) => {
    const [formData, setFormData] = useState({ employeeName: '', temperature: '', systolic: '', diastolic: '', pulseRate: '', remarks: '', medicineGiven: '' });
    const uniqueMedicines = Array.from(new Set(inventory.filter((m: any) => m.quantity > 0).map((b: any) => b.scientificName))).sort();

    // Fallback if no employees available
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedicalRecord({ ...formData, temperature: Number(formData.temperature), systolic: Number(formData.systolic), diastolic: Number(formData.diastolic) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Add Medical Record</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                    <select required value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        <option value="">-- Select Employee --</option>
                        {employees.map((e: any) => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Temperature (°C)</label><input required type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({ ...formData, temperature: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Pulse Rate (bpm)</label><input required type="number" value={formData.pulseRate} onChange={e => setFormData({ ...formData, pulseRate: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Systolic (mmHg)</label><input required type="number" value={formData.systolic} onChange={e => setFormData({ ...formData, systolic: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Diastolic (mmHg)</label><input required type="number" value={formData.diastolic} onChange={e => setFormData({ ...formData, diastolic: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Remarks / Symptoms</label><textarea required value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm h-full resize-none" rows={2} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Given</label><select required value={formData.medicineGiven} onChange={e => setFormData({ ...formData, medicineGiven: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-white"><option value="">-- Select Medicine --</option><option value="None">None</option>{uniqueMedicines.map((med: any) => <option key={med} value={med}>{med}</option>)}</select></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add Record</Button></div>
            </form>
        </div>
    );
};

const EditMedicalRecordBody = ({ onClose, editMedicalRecord, data, inventory, employees }: any) => {
    const [formData, setFormData] = useState({ employeeName: data.employeeName, temperature: data.temperature, systolic: data.systolic, diastolic: data.diastolic, pulseRate: data.pulseRate, remarks: data.remarks, medicineGiven: data.medicineGiven });
    const uniqueMedicines = Array.from(new Set(inventory.filter((m: any) => m.quantity > 0).map((b: any) => b.scientificName))).concat(data.medicineGiven && data.medicineGiven !== 'None' ? [data.medicineGiven] : []).filter((v, i, a) => a.indexOf(v) === i).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editMedicalRecord(data.id, { ...formData, temperature: Number(formData.temperature), systolic: Number(formData.systolic), diastolic: Number(formData.diastolic) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Edit Medical Record</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                    <select required value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        <option value={data.employeeName}>{data.employeeName}</option>
                        {employees.map((e: any) => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Temperature (°C)</label><input required type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({ ...formData, temperature: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Pulse Rate (bpm)</label><input required type="number" value={formData.pulseRate} onChange={e => setFormData({ ...formData, pulseRate: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Systolic (mmHg)</label><input required type="number" value={formData.systolic} onChange={e => setFormData({ ...formData, systolic: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Diastolic (mmHg)</label><input required type="number" value={formData.diastolic} onChange={e => setFormData({ ...formData, diastolic: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Remarks / Symptoms</label><textarea required value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm h-full resize-none" rows={2} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Given</label><select required value={formData.medicineGiven} onChange={e => setFormData({ ...formData, medicineGiven: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-white"><option value="">-- Select Medicine --</option><option value="None">None</option>{uniqueMedicines.map((med: any) => <option key={med} value={med}>{med}</option>)}</select></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save Changes</Button></div>
            </form>
        </div>
    );
};

/* --- MULTI-ITEM REQUESTS --- */
const AddAdminRequestBody = ({ onClose, addManualApprovedRequest, inventory, employees }: any) => {
    const [employeeName, setEmployeeName] = useState('');
    const [items, setItems] = useState([{ medicineName: '', quantity: 1 }]);
    const [reason, setReason] = useState('');

    const uniqueMedicines = Array.from(new Set(inventory.filter((b: any) => b.quantity > 0).map((b: any) => b.scientificName))).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeName.trim() || items.length === 0 || items.some(i => !i.medicineName || i.quantity <= 0)) return;
        addManualApprovedRequest({ employeeName: employeeName.trim(), items: items.map(i => ({ medicineName: i.medicineName, quantity: Number(i.quantity) })), reason: reason.trim() });
        onClose();
    };

    const addItem = () => setItems([...items, { medicineName: '', quantity: 1 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Add Manual Request</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-sm text-slate-500">Requests added here are automatically marked as "Approved" and will deduct stock immediately if available.</p>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                    <select required value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        <option value="">-- Select Employee --</option>
                        {employees.map((e: any) => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Medicines Requested</label>
                    <div className="space-y-2">
                        {items.map((item, index) => {
                            let stockRemaining = 0;
                            if (item.medicineName) {
                                stockRemaining = inventory.filter((b: any) => b.scientificName.toLowerCase() === item.medicineName.toLowerCase()).reduce((acc: any, curr: any) => acc + curr.quantity, 0);
                            }
                            return (
                                <div key={index} className="flex flex-col gap-1 p-3 border rounded-lg bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <select required value={item.medicineName} onChange={e => updateItem(index, 'medicineName', e.target.value)} className="flex-1 border rounded-md px-2 py-1.5 text-sm bg-white">
                                            <option value="">Select Medicine...</option>
                                            {uniqueMedicines.map((med: any) => <option key={med} value={med}>{med}</option>)}
                                        </select>
                                        <input required type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} className="w-20 border rounded-md px-2 py-1.5 text-sm bg-white" placeholder="Qty" />
                                        {items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><Trash2 size={16} /></button>}
                                    </div>
                                    {item.medicineName && <p className={`text-[10px] font-medium ${stockRemaining >= item.quantity ? 'text-emerald-600' : 'text-red-500'}`}>{stockRemaining >= item.quantity ? `In Stock: ${stockRemaining} available` : 'Insufficient Stock.'}</p>}
                                </div>
                            );
                        })}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2 w-full gap-1 text-brand-blue border-brand-blue hover:bg-brand-blue-50"><Plus size={14} /> Add Medicine</Button>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Symptoms (Optional)</label><textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm min-h-[60px]" placeholder="e.g. Headache, Fever..." /></div>
                <div className="pt-2 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add Approved Request</Button></div>
            </form>
        </div>
    );
};


const RequestMedicineBody = ({ onClose, addRequest, inventory, employees }: any) => {
    const [employeeName, setEmployeeName] = useState('');
    const [items, setItems] = useState([{ illnessFilter: '', medicineName: '', quantity: 1 }]);
    const [reason, setReason] = useState('');

    const availableIllnesses = Array.from(new Set(inventory.filter((m: any) => m.quantity > 0 && m.illness).map((m: any) => m.illness).flatMap((i: any) => i.split(',').map((x: any) => x.trim())))).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addRequest({ employeeName, items: items.map(i => ({ medicineName: i.medicineName, quantity: Number(i.quantity) })), reason });
        onClose();
    };

    const addItem = () => setItems([...items, { illnessFilter: '', medicineName: '', quantity: 1 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'illnessFilter') newItems[index].medicineName = '';
        setItems(newItems);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Request Medicine</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                    <select required value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        <option value="">-- Select Employee --</option>
                        {employees.map((e: any) => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Medicines ({items.length})</label>
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const availableMedicines = Array.from(new Set(inventory.filter((m: any) => m.quantity > 0).filter((m: any) => !item.illnessFilter || m.illness.toLowerCase().includes(item.illnessFilter.toLowerCase())).map((m: any) => m.scientificName))).sort();
                            return (
                                <div key={index} className="p-3 border rounded-lg bg-slate-50 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <select className="flex-1 border rounded-md px-2 py-1 text-xs" value={item.illnessFilter} onChange={e => updateItem(index, 'illnessFilter', e.target.value)}>
                                            <option value="">-- All Illnesses --</option>
                                            {availableIllnesses.map((ill: any) => <option key={ill} value={ill}>{ill}</option>)}
                                        </select>
                                        {items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1"><X size={14} /></button>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select required className="flex-1 border rounded-md px-2 py-1.5 text-sm" value={item.medicineName} onChange={e => updateItem(index, 'medicineName', e.target.value)}>
                                            <option value="">-- Select Medicine --</option>
                                            {availableMedicines.map((med: any) => <option key={med} value={med}>{med}</option>)}
                                        </select>
                                        <input required type="number" min="1" className="w-20 border rounded-md px-2 py-1.5 text-sm" placeholder="Qty" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2 w-full gap-1 text-brand-blue border-brand-blue hover:bg-brand-blue-50"><Plus size={14} /> Add Another Medicine</Button>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Symptoms</label><textarea required value={reason} onChange={e => setReason(e.target.value)} rows={2} className="w-full border rounded-md px-3 py-2 text-sm resize-none" /></div>
                <div className="pt-2 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" disabled={items.some(i => !i.medicineName || i.quantity <= 0)}>Submit Request</Button></div>
            </form>
        </div>
    );
};

const EditRequestBody = ({ onClose, editRequest, data }: any) => {
    // Basic editing of Reason - in a real app might edit items too, but keep simple
    const [reason, setReason] = useState(data.reason);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editRequest(data.id, { reason });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md min-h-[350px] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0"><h3 className="font-bold text-brand-blue-900 text-lg">Edit Request Details</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex flex-col flex-1">
                <p className="text-sm text-slate-600">Editing request reason for <strong>{data.employeeName}</strong>.</p>
                <div className="flex-1 flex flex-col"><label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Symptoms</label><textarea required value={reason} onChange={e => setReason(e.target.value)} className="w-full h-full min-h-[120px] border rounded-md px-3 py-2 text-sm resize-none" /></div>
                <div className="pt-2 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save</Button></div>
            </form>
        </div>
    );
}

/* --- VIEW MEDICAL HISTORY --- */
const ViewMedicalHistoryBody = ({ onClose, employee, medicalRecords }: any) => {
    const [monthFilter, setMonthFilter] = useState('');
    const history = medicalRecords
        .filter((r: any) => r.employeeName.toLowerCase() === employee.name.toLowerCase())
        .filter((r: any) => !monthFilter || r.date.startsWith(monthFilter))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleExportPdf = () => {
        const headers = ['Date', 'Temp (°C)', 'BP (mmHg)', 'Pulse Rate', 'Medicine Given', 'Remarks'];
        const data = history.map((record: any) => [
            format(new Date(record.date), 'MMM dd, yyyy h:mm a'),
            record.temperature.toString(),
            `${record.systolic}/${record.diastolic}`,
            record.pulseRate ? record.pulseRate.toString() : '--',
            record.medicineGiven || 'None',
            record.remarks || 'None'
        ]);
        import('../../utils/exportPdf').then(({ exportToPdf }) => {
            exportToPdf({
                title: `${employee.name} Consultation Records`,
                headers,
                data,
                filename: `${employee.name.replace(/\s+/g, '_')}_Consultations`
            });
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0">
                <div><h3 className="font-bold text-brand-blue-900 text-lg">{employee.name}'s Medical History</h3><p className="text-sm text-brand-blue-700">Detailed medical records and vitals</p></div>
                <div className="flex items-center gap-4">
                    <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="border border-brand-blue-200 rounded-md px-2 py-1 text-sm bg-white" title="Filter by Month" />
                    <Button variant="outline" size="sm" onClick={handleExportPdf} className="h-8 gap-2 bg-white text-brand-blue border-brand-blue-200 hover:bg-brand-blue-50"><FileDown size={14} /> Export PDF</Button>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors ml-2"><X size={20} /></button>
                </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {history.length === 0 ? <div className="text-center py-12"><FileText size={48} className="mx-auto text-slate-300 mb-4" /><p className="text-slate-500 font-medium">No records found.</p></div> :
                    <div className="grid gap-4">{history.map((record: any) => (
                        <div key={record.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                            <div className="font-semibold text-slate-800 border-b pb-2 mb-2">{format(new Date(record.date), 'MMMM dd, yyyy - h:mm a')}</div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100"><div className="flex items-center gap-1.5 text-orange-600 mb-1"><Thermometer size={14} /><span className="text-xs font-semibold">Temp</span></div><div className="text-lg font-bold text-orange-900">{record.temperature}°C</div></div>
                                <div className="bg-red-50 rounded-lg p-3 border border-red-100"><div className="flex items-center gap-1.5 text-red-600 mb-1"><Droplets size={14} /><span className="text-xs font-semibold">BP</span></div><div className="text-lg font-bold text-red-900">{record.systolic}/{record.diastolic}</div></div>
                                <div className="bg-sky-50 rounded-lg p-3 border border-sky-100"><div className="flex items-center gap-1.5 text-sky-600 mb-1"><Activity size={14} /><span className="text-xs font-semibold">Pulse</span></div><div className="text-lg font-bold text-sky-900">{record.pulseRate} bpm</div></div>
                                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100"><div className="text-xs text-emerald-600 font-semibold mb-1">Meds</div><div className="text-sm text-emerald-900">{record.medicineGiven || 'None'}</div></div>
                            </div>
                            {record.remarks && <div className="bg-slate-50 rounded-lg p-3 border border-slate-100"><div className="text-xs font-semibold text-slate-500 mb-1">Remarks</div><p className="text-sm">{record.remarks}</p></div>}
                        </div>
                    ))}</div>}
            </div>
            <div className="bg-white p-4 flex justify-end shrink-0"><Button onClick={onClose} variant="primary">Close History</Button></div>
        </div>
    );
};

/* --- VIEW MEDICAL INFO --- */
const ViewMedicalInfoBody = ({ onClose, employee, context }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ bloodType: '', allergies: '', preExistingConditions: '', emergencyContact: '' });
    useEffect(() => { if (employee) { setFormData({ bloodType: employee.medicalInfo?.bloodType || '', allergies: employee.medicalInfo?.allergies || '', preExistingConditions: employee.medicalInfo?.preExistingConditions || '', emergencyContact: employee.medicalInfo?.emergencyContact || '' }); setIsEditing(false); } }, [employee]);
    const handleSave = () => { context.editEmployee(employee.id, { medicalInfo: formData }); setIsEditing(false); };
    return (
        <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0"><div className="flex items-center gap-3"><div className="bg-white p-2 rounded-lg text-brand-blue"><User size={20} /></div><div><h3 className="font-bold text-brand-blue-900 text-lg">Medical Information</h3><p className="text-xs">For: {employee.name}</p></div></div><button type="button" onClick={onClose} className="text-brand-blue-500"><X size={20} /></button></div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="flex justify-end border-b pb-4">{!isEditing ? <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2"><Edit3 size={16} /> Edit Details</Button> : <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={handleSave} className="gap-2 bg-emerald-600"><Save size={16} /> Save Changes</Button></div>}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><Droplets size={16} className="text-red-500" /> Blood Type</h4>{isEditing ? <input value={formData.bloodType} onChange={e => setFormData({ ...formData, bloodType: e.target.value })} className="border p-2" /> : <p className="font-medium text-lg">{formData.bloodType || 'Not Specified'}</p>}</div></Card>
                    <Card className="p-4 border"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><Phone size={16} className="text-emerald-500" /> Emergency Contact</h4>{isEditing ? <input value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} className="border p-2" /> : <p className="font-medium">{formData.emergencyContact || 'Not Specified'}</p>}</div></Card>
                    <Card className="p-4 border md:col-span-2"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><AlertCircle size={16} className="text-amber-500" /> Allergies</h4>{isEditing ? <textarea value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} className="border p-2 w-full" /> : <p className="font-medium">{formData.allergies || 'None'}</p>}</div></Card>
                    <Card className="p-4 border md:col-span-2"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><HeartPulse size={16} className="text-rose-500" /> Pre-existing Conditions</h4>{isEditing ? <textarea value={formData.preExistingConditions} onChange={e => setFormData({ ...formData, preExistingConditions: e.target.value })} className="border p-2 w-full" /> : <p className="font-medium">{formData.preExistingConditions || 'None'}</p>}</div></Card>
                </div>
            </div>
        </div>
    );
};

/* --- VIEW REMARKS --- */
const ViewRemarksBody = ({ onClose, record }: any) => {
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl min-h-[400px] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Record Details</h3><button type="button" onClick={onClose} className="text-brand-blue-500 hover:bg-brand-blue-100 rounded-lg p-1 transition-colors"><X size={20} /></button></div>
            <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div><h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 border-b pb-2"><FileText size={16} className="text-brand-blue" /> Remarks / Symptoms</h4><p className="text-sm p-3 bg-slate-50 border rounded-lg">{record.remarks || "No remarks provided."}</p></div>
                <div><h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 border-b pb-2"><Pill size={16} className="text-brand-blue" /> Medicine Given</h4><p className="text-sm p-3 bg-slate-50 border rounded-lg">{record.medicineGiven || "No medicine given."}</p></div>
                <div className="flex justify-end pt-4 shrink-0"><Button onClick={onClose}>Close</Button></div>
            </div>
        </div>
    );
};

/* --- VIEW GIVEN MEDICINES --- */
const ViewGivenMedicinesBody = ({ onClose, employee, context }: any) => {
    const [monthFilter, setMonthFilter] = useState('');

    // combine approved requests and medical records with medicines
    const approvedRequests = context.requests.filter((r: any) => r.employeeName === employee.name && r.status === 'Approved');
    const recordsWithMeds = context.medicalRecords.filter((r: any) => r.employeeName === employee.name && r.medicineGiven && r.medicineGiven !== 'None');

    const combinedList = [
        ...approvedRequests.map((r: any) => ({
            id: r.id,
            date: r.requestDate,
            type: 'Request',
            details: r.items.map((i: any) => `${i.quantity}x ${i.medicineName}`).join(', '),
            notes: r.reason || ''
        })),
        ...recordsWithMeds.map((r: any) => ({
            id: r.id,
            date: r.date,
            type: 'Consultation',
            details: r.medicineGiven,
            notes: r.remarks || ''
        }))
    ]
        .filter((item: any) => !monthFilter || item.date.startsWith(monthFilter))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleExportPdf = () => {
        const headers = ['Date', 'Type', 'Medicine Details', 'Remarks/Reason'];
        const data = combinedList.map((item: any) => [
            format(new Date(item.date), 'MMM dd, yyyy h:mm a'),
            item.type,
            item.details,
            item.notes || 'None'
        ]);
        import('../../utils/exportPdf').then(({ exportToPdf }) => {
            exportToPdf({
                title: `${employee.name} - Given Medicines`,
                headers,
                data,
                filename: `${employee.name.replace(/\s+/g, '_')}_Given_Medicines`
            });
        });
    };

    return (
        <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-brand-blue"><Pill size={20} /></div>
                    <div>
                        <h3 className="font-bold text-brand-blue-900 text-lg">Given Medicines</h3>
                        <p className="text-xs">For: {employee.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="border border-brand-blue-200 rounded-md px-2 py-1 text-sm bg-white" title="Filter by Month" />
                    <Button variant="outline" size="sm" onClick={handleExportPdf} className="h-8 gap-2 bg-white text-brand-blue border-brand-blue-200 hover:bg-brand-blue-50"><FileDown size={14} /> Export</Button>
                    <button type="button" onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors ml-2"><X size={20} /></button>
                </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 h-full min-h-[300px]">
                {combinedList.length === 0 ? (
                    <div className="text-center py-12"><Pill size={48} className="mx-auto text-slate-300 mb-4" /><p className="text-slate-500 font-medium">No medicines given.</p></div>
                ) : (
                    <div className="grid gap-4">
                        {combinedList.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center border-b pb-2 mb-2">
                                    <span className="font-semibold text-slate-800">{format(new Date(item.date), 'MMMM dd, yyyy - h:mm a')}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.type === 'Request' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}>{item.type}</span>
                                </div>
                                <div className="mt-3">
                                    <p className="text-brand-blue-900 font-bold text-lg mb-1">{item.details}</p>
                                    {item.notes && <p className="text-sm text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 mt-2">"{item.notes}"</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bg-white p-4 flex justify-end shrink-0 border-t border-slate-200">
                <Button onClick={onClose} variant="primary">Close</Button>
            </div>
        </div>
    );
};
