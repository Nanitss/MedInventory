import { useState, useEffect } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card } from './primitives';
import { X, Save, Edit3, User, AlertCircle, Phone, Droplets, HeartPulse, Activity, Thermometer, FileText, Pill, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export const GlobalModal = () => {
    const {
        modalState,
        closeModal,
        addEmployee,
        addMedicine,
        addMedicalRecord,
        addRequest,
        addManualApprovedRequest,
        inventory,
        requests,
        medicalRecords
    } = useAppContext();

    if (modalState.type === 'NONE') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <ModalBody type={modalState.type} data={modalState.data} onClose={closeModal} context={{ addEmployee, addMedicine, addMedicalRecord, addRequest, addManualApprovedRequest, inventory, requests, medicalRecords }} />
        </div>
    );
};

const ModalBody = ({ type, data, onClose, context }: any) => {
    switch (type) {
        case 'ADD_EMPLOYEE':
            return <AddEmployeeBody onClose={onClose} addEmployee={context.addEmployee} />;
        case 'ADD_MEDICINE':
            return <AddMedicineBody onClose={onClose} addMedicine={context.addMedicine} />;
        case 'ADD_MEDICAL_RECORD':
            return <AddMedicalRecordBody onClose={onClose} addMedicalRecord={context.addMedicalRecord} inventory={context.inventory} />;
        case 'ADD_ADMIN_REQUEST':
            return <AddAdminRequestBody onClose={onClose} addManualApprovedRequest={context.addManualApprovedRequest} inventory={context.inventory} requests={context.requests} />;
        case 'REQUEST_MEDICINE':
            return <RequestMedicineBody onClose={onClose} addRequest={context.addRequest} inventory={context.inventory} />;
        case 'VIEW_MEDICAL_HISTORY':
            return <ViewMedicalHistoryBody onClose={onClose} employee={data} medicalRecords={context.medicalRecords} />;
        case 'VIEW_MEDICAL_INFO':
            return <ViewMedicalInfoBody onClose={onClose} employee={data} />;
        case 'VIEW_REMARKS':
            return <ViewRemarksBody onClose={onClose} record={data} />;
        default:
            return null;
    }
};

/* --- ADD EMPLOYEE --- */
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
                <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. Maria Santos" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
                        <input required value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. 0917-123-4567" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                        <input required type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. 28" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label>
                        <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all">
                            <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                        <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="City, Province" />
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add Employee</Button></div>
            </form>
        </div>
    );
};

/* --- ADD MEDICINE --- */
const AddMedicineBody = ({ onClose, addMedicine }: any) => {
    const [formData, setFormData] = useState({ scientificName: '', brand: '', milligrams: '', expiryDate: '', illness: '', quantity: '' });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedicine({ ...formData, milligrams: Number(formData.milligrams), expiryDate: new Date(formData.expiryDate).toISOString(), quantity: Number(formData.quantity) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-blue-900 text-lg">Add New Medicine</h3>
                <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Generic Name</label><input required value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all" placeholder="e.g. Paracetamol" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Brand Name</label><input required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all" placeholder="e.g. Biogesic" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Milligrams (mg)</label><input required type="number" value={formData.milligrams} onChange={e => setFormData({ ...formData, milligrams: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all" placeholder="e.g. 500" /></div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Illness / Use</label><input required value={formData.illness} onChange={e => setFormData({ ...formData, illness: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all" placeholder="e.g. Pain relief, Fever" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label><input required type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label><input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all" placeholder="e.g. 100" /></div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add to Inventory</Button></div>
            </form>
        </div>
    );
};

/* --- ADD MEDICAL RECORD --- */
const AddMedicalRecordBody = ({ onClose, addMedicalRecord, inventory }: any) => {
    const [formData, setFormData] = useState({ employeeName: '', temperature: '', systolic: '', diastolic: '', pulseRate: '', remarks: '', medicineGiven: '' });

    const uniqueMedicines = Array.from(new Set(inventory.filter((med: any) => med.quantity > 0).map((b: any) => b.scientificName))).sort();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedicalRecord({ ...formData, temperature: Number(formData.temperature), systolic: Number(formData.systolic), diastolic: Number(formData.diastolic) });
        onClose();
    };
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-blue-900 text-lg">Add Medical Record</h3>
                <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label><input required value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. Juan Dela Cruz" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Temperature (°C)</label><input required type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({ ...formData, temperature: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. 36.5" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Pulse Rate (bpm)</label><input required type="number" value={formData.pulseRate} onChange={e => setFormData({ ...formData, pulseRate: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. 75" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Systolic (mmHg)</label><input required type="number" value={formData.systolic} onChange={e => setFormData({ ...formData, systolic: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. 120" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Diastolic (mmHg)</label><input required type="number" value={formData.diastolic} onChange={e => setFormData({ ...formData, diastolic: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="e.g. 80" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Remarks / Symptoms</label><textarea required value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all resize-none h-full" placeholder="..." rows={2} /></div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Given</label>
                        <select required value={formData.medicineGiven} onChange={e => setFormData({ ...formData, medicineGiven: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all bg-white shadow-sm">
                            <option value="">-- Select Medicine --</option>
                            <option value="None">None</option>
                            {uniqueMedicines.map((med: any) => <option key={med} value={med}>{med as string}</option>)}
                        </select>
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add Record</Button></div>
            </form>
        </div>
    );
};

/* --- ADD ADMIN REQUEST --- */
const AddAdminRequestBody = ({ onClose, addManualApprovedRequest, inventory, requests }: any) => {
    const [employeeName, setEmployeeName] = useState('');
    const [medicineRequested, setMedicineRequested] = useState('');
    const [reason, setReason] = useState('');

    const uniqueMedicines = Array.from(new Set(inventory.map((b: any) => b.scientificName))).sort();
    const uniqueEmployees = Array.from(new Set(requests.map((r: any) => r.employeeName))).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeName.trim() || !medicineRequested) return;
        addManualApprovedRequest({ employeeName: employeeName.trim(), medicineRequested, reason: reason.trim() });
        onClose();
    };

    let stockRemaining = 0;
    if (medicineRequested) {
        stockRemaining = inventory.filter((b: any) => b.scientificName.toLowerCase() === medicineRequested.toLowerCase()).reduce((acc: any, curr: any) => acc + curr.quantity, 0);
    }

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-blue-900 text-lg">Add Manual Request</h3>
                <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-sm text-slate-500 mb-4">Requests added here are automatically marked as "Approved" and will deduct stock immediately if available.</p>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name</label>
                    <input required type="text" list="employee-names" value={employeeName} onChange={e => setEmployeeName(e.target.value)} placeholder="Type or select name..." className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all shadow-sm" />
                    <datalist id="employee-names">{uniqueEmployees.map((name: any) => <option key={name} value={name} />)}</datalist>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Requested</label>
                    <select required value={medicineRequested} onChange={e => setMedicineRequested(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all shadow-sm bg-white">
                        <option value="">Select Medicine...</option>
                        {uniqueMedicines.map((med: any) => <option key={med} value={med}>{med as string}</option>)}
                    </select>
                    {medicineRequested && <p className={`text-xs mt-1 font-medium ${stockRemaining > 0 ? 'text-emerald-600' : 'text-red-500 flex items-center gap-1'}`}>{stockRemaining > 0 ? `In Stock: ${stockRemaining} available` : <><AlertTriangle size={12} />Out of Stock. Request will be approved but no stock logic</>}</p>}
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Symptoms (Optional)</label><textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all min-h-[80px]" placeholder="e.g. Headache, Fever..." /></div>
                <div className="pt-4 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Add Approved Request</Button></div>
            </form>
        </div>
    );
};

/* --- REQUEST MEDICINE --- */
const RequestMedicineBody = ({ onClose, addRequest, inventory }: any) => {
    const [selectedIllness, setSelectedIllness] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [reason, setReason] = useState('');

    const availableIllnesses = Array.from(new Set(inventory.filter((med: any) => med.quantity > 0 && med.illness).map((med: any) => med.illness).flatMap((illness: any) => illness.split(',').map((i: any) => i.trim())))).sort();
    const availableMedicines = Array.from(new Set(inventory.filter((med: any) => med.quantity > 0).filter((med: any) => !selectedIllness || med.illness.toLowerCase().includes(selectedIllness.toLowerCase())).map((med: any) => med.scientificName))).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addRequest({ employeeName: 'Juan Dela Cruz', medicineRequested: selectedMedicine, reason });
        onClose();
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Request Medicine</h3><button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Type of Illness</label><select value={selectedIllness} onChange={e => { setSelectedIllness(e.target.value); setSelectedMedicine(''); }} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm mb-4"><option value="">-- All Illnesses --</option>{availableIllnesses.map((illness: any) => <option key={illness} value={illness}>{illness as string}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Available Medicines</label><select required value={selectedMedicine} onChange={e => setSelectedMedicine(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"><option value="" disabled>-- Select a medicine --</option>{availableMedicines.map((name: any) => <option key={name} value={name}>{name as string}</option>)}</select>{availableMedicines.length === 0 && <p className="text-xs text-red-500 mt-2 font-medium">No medicines available.</p>}</div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Reason / Symptoms</label><textarea required value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm resize-none" placeholder="..." /></div>
                <div className="pt-4 flex justify-end gap-3 mt-4"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" disabled={!selectedMedicine || !reason.trim() || availableMedicines.length === 0}>Submit Request</Button></div>
            </form>
        </div>
    );
};

/* --- VIEW MEDICAL HISTORY --- */
const ViewMedicalHistoryBody = ({ onClose, employee, medicalRecords }: any) => {
    const history = medicalRecords.filter((r: any) => r.employeeName.toLowerCase() === employee.name.toLowerCase()).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0"><div><h3 className="font-bold text-brand-blue-900 text-lg">{employee.name}'s Medical History</h3><p className="text-sm text-brand-blue-700">Detailed medical records and vitals</p></div><button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors"><X size={20} /></button></div>
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
const ViewMedicalInfoBody = ({ onClose, employee }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ bloodType: '', allergies: '', preExistingConditions: '', emergencyContact: '' });
    useEffect(() => { if (employee) { setFormData({ bloodType: employee.medicalInfo?.bloodType || '', allergies: employee.medicalInfo?.allergies || '', preExistingConditions: employee.medicalInfo?.preExistingConditions || '', emergencyContact: employee.medicalInfo?.emergencyContact || '' }); setIsEditing(false); } }, [employee]);
    const handleSave = () => { alert("Saved locally only"); setIsEditing(false); };
    return (
        <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0"><div className="flex items-center gap-3"><div className="bg-white p-2 rounded-lg text-brand-blue"><User size={20} /></div><div><h3 className="font-bold text-brand-blue-900 text-lg">Medical Information</h3><p className="text-xs">For: {employee.name}</p></div></div><button onClick={onClose} className="text-brand-blue-500"><X size={20} /></button></div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="flex justify-end border-b pb-4">{!isEditing ? <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2"><Edit3 size={16} /> Edit</Button> : <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={handleSave} className="gap-2 bg-emerald-600"><Save size={16} /> Save</Button></div>}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><Droplets size={16} className="text-red-500" /> Blood Type</h4>{isEditing ? <input value={formData.bloodType} onChange={e => setFormData({ ...formData, bloodType: e.target.value })} className="border p-2" /> : <p className="font-medium text-lg">{formData.bloodType || 'Not Specified'}</p>}</div></Card>
                    <Card className="p-4 border"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><Phone size={16} className="text-emerald-500" /> Contact</h4>{isEditing ? <input value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} className="border p-2" /> : <p className="font-medium">{formData.emergencyContact || 'Not Specified'}</p>}</div></Card>
                    <Card className="p-4 border md:col-span-2"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><AlertCircle size={16} className="text-amber-500" /> Allergies</h4>{isEditing ? <textarea value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} className="border p-2 w-full" /> : <p className="font-medium">{formData.allergies || 'None'}</p>}</div></Card>
                    <Card className="p-4 border md:col-span-2"><div className="flex flex-col"><h4 className="flex items-center gap-2 font-semibold text-sm mb-2"><HeartPulse size={16} className="text-rose-500" /> Conditions</h4>{isEditing ? <textarea value={formData.preExistingConditions} onChange={e => setFormData({ ...formData, preExistingConditions: e.target.value })} className="border p-2 w-full" /> : <p className="font-medium">{formData.preExistingConditions || 'None'}</p>}</div></Card>
                </div>
            </div>
        </div>
    );
};

/* --- VIEW REMARKS --- */
const ViewRemarksBody = ({ onClose, record }: any) => {
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between"><h3 className="font-bold text-brand-blue-900 text-lg">Record Details</h3><button onClick={onClose} className="text-brand-blue-500"><X size={20} /></button></div>
            <div className="p-6 space-y-6">
                <div><h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 border-b pb-2"><FileText size={16} className="text-brand-blue" /> Remarks / Symptoms</h4><p className="text-sm p-3 bg-slate-50 border rounded-lg">{record.remarks || "No remarks provided."}</p></div>
                <div><h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 border-b pb-2"><Pill size={16} className="text-brand-blue" /> Medicine Given</h4><p className="text-sm p-3 bg-slate-50 border rounded-lg">{record.medicineGiven || "No medicine given."}</p></div>
                <div className="flex justify-end pt-4"><Button onClick={onClose}>Close</Button></div>
            </div>
        </div>
    );
};
