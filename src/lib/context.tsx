import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { MedicineBatch, EmployeeRequest, MedicalRecord, Employee, DisposedMedicine } from '../types';
import type { ToastType, ToastData } from '../components/ui/Toast';
import * as db from './db';

export type ModalType =
    | 'NONE'
    | 'ADD_MEDICINE'
    | 'REQUEST_MEDICINE'
    | 'ADD_ADMIN_REQUEST'
    | 'ADD_EMPLOYEE'
    | 'ADD_MEDICAL_RECORD'
    | 'VIEW_MEDICAL_HISTORY'
    | 'VIEW_MEDICAL_INFO'
    | 'VIEW_REMARKS'
    | 'EDIT_MEDICINE'
    | 'EDIT_MEDICAL_RECORD'
    | 'EDIT_REQUEST'
    | 'EDIT_EMPLOYEE'
    | 'DISPOSE_MEDICINE';

export interface ModalState {
    type: ModalType;
    data?: any;
}

interface AppContextType {
    inventory: MedicineBatch[];
    requests: EmployeeRequest[];
    medicalRecords: MedicalRecord[];
    employees: Employee[];
    disposedMedicines: DisposedMedicine[];
    modalState: ModalState;
    loading: boolean;
    toasts: ToastData[];
    openModal: (type: ModalType, data?: any) => void;
    closeModal: () => void;
    showToast: (message: string, type?: ToastType) => void;
    dismissToast: (id: string) => void;

    addMedicine: (med: Omit<MedicineBatch, 'id' | 'addedDate'>) => void;
    editMedicine: (id: string, updates: Partial<MedicineBatch>) => void;
    disposeMedicine: (id: string, qty: number) => void;

    addRequest: (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => void;
    addManualApprovedRequest: (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => void;
    editRequest: (id: string, updates: Partial<EmployeeRequest>) => void;
    editRequestWithInventory: (id: string, updates: Partial<EmployeeRequest>) => void;
    approveRequest: (requestId: string) => void;
    rejectRequest: (requestId: string) => void;

    addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => void;
    editMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void;

    addEmployee: (emp: Omit<Employee, 'id'>) => void;
    editEmployee: (id: string, updates: Partial<Employee>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let toastCounter = 0;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = useState<MedicineBatch[]>([]);
    const [requests, setRequests] = useState<EmployeeRequest[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [disposedMedicines, setDisposedMedicines] = useState<DisposedMedicine[]>([]);
    const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState<ToastData[]>([]);

    // ─── Toast helpers ───────────────────────────────────────────────────────
    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = `toast-${++toastCounter}`;
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // ─── Fetch all data on mount ─────────────────────────────────────────────
    useEffect(() => {
        const loadAll = async () => {
            try {
                const [inv, reqs, records, emps, disposed] = await Promise.all([
                    db.fetchInventory(),
                    db.fetchRequests(),
                    db.fetchMedicalRecords(),
                    db.fetchEmployees(),
                    db.fetchDisposedMedicines(),
                ]);
                setInventory(inv);
                setRequests(reqs);
                setMedicalRecords(records);
                setEmployees(emps);
                setDisposedMedicines(disposed);
            } catch (err) {
                console.error('Failed to load data from Supabase:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const openModal = (type: ModalType, data?: any) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: 'NONE' });
    };

    // ─── Medicine Inventory ──────────────────────────────────────────────────

    const addMedicine = useCallback(async (med: Omit<MedicineBatch, 'id' | 'addedDate'>) => {
        try {
            const newMed = await db.insertMedicine(med);
            setInventory(prev => [newMed, ...prev]);
            showToast('Medicine added successfully!');
        } catch (err) {
            console.error('Failed to add medicine:', err);
            showToast('Failed to add medicine.', 'error');
        }
    }, [showToast]);

    const editMedicine = useCallback(async (id: string, updates: Partial<MedicineBatch>) => {
        try {
            const updated = await db.updateMedicine(id, updates);
            setInventory(prev => prev.map(m => m.id === id ? updated : m));
            showToast('Medicine updated successfully!');
        } catch (err) {
            console.error('Failed to edit medicine:', err);
            showToast('Failed to update medicine.', 'error');
        }
    }, [showToast]);

    const disposeMedicine = useCallback(async (id: string, qty: number) => {
        const batch = inventory.find(m => m.id === id);
        if (!batch) return;

        try {
            const disposed = await db.insertDisposedMedicine({
                scientificName: batch.scientificName,
                brand: batch.brand,
                milligrams: batch.milligrams,
                quantity: qty,
                addedDate: batch.addedDate,
                expiryDate: batch.expiryDate,
                disposedDate: new Date().toISOString(),
            });
            setDisposedMedicines(prev => [disposed, ...prev]);

            const remaining = batch.quantity - qty;
            if (remaining <= 0) {
                await db.deleteMedicine(id);
                setInventory(prev => prev.filter(m => m.id !== id));
            } else {
                const updated = await db.updateMedicine(id, { quantity: remaining });
                setInventory(prev => prev.map(m => m.id === id ? updated : m));
            }
            showToast('Medicine disposed successfully!');
        } catch (err) {
            console.error('Failed to dispose medicine:', err);
            showToast('Failed to dispose medicine.', 'error');
        }
    }, [inventory, showToast]);

    // ─── Employee Requests ───────────────────────────────────────────────────

    const addRequest = useCallback(async (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => {
        try {
            const newReq = await db.insertRequest(req, 'Pending');
            setRequests(prev => [newReq, ...prev]);
            showToast('Request submitted successfully!');
        } catch (err) {
            console.error('Failed to add request:', err);
            showToast('Failed to submit request.', 'error');
        }
    }, [showToast]);

    const editRequest = useCallback(async (id: string, updates: Partial<EmployeeRequest>) => {
        try {
            const updated = await db.updateRequest(id, updates);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
            showToast('Request updated successfully!');
        } catch (err) {
            console.error('Failed to edit request:', err);
            showToast('Failed to update request.', 'error');
        }
    }, [showToast]);

    // Inventory deduction helper
    const deductInventoryForItems = useCallback(async (items: { medicineName: string; quantity: number }[]) => {
        const currentInv = [...inventory];
        const updates: { id: string; quantity: number }[] = [];
        const toDelete: string[] = [];

        for (const item of items) {
            let remaining = item.quantity;
            const batches = currentInv
                .filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase() && b.quantity > 0)
                .sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime());

            for (const batch of batches) {
                if (remaining <= 0) break;
                const deduction = Math.min(batch.quantity, remaining);
                batch.quantity -= deduction;
                remaining -= deduction;

                if (batch.quantity <= 0) {
                    toDelete.push(batch.id);
                } else {
                    updates.push({ id: batch.id, quantity: batch.quantity });
                }
            }
        }

        for (const u of updates) {
            await db.updateMedicine(u.id, { quantity: u.quantity });
        }
        for (const id of toDelete) {
            await db.deleteMedicine(id);
        }

        const freshInv = await db.fetchInventory();
        setInventory(freshInv);
    }, [inventory]);

    // Restore inventory helper
    const restoreInventoryForItems = useCallback(async (items: { medicineName: string; quantity: number }[]) => {
        const currentInv = [...inventory];
        for (const item of items) {
            let toRestore = item.quantity;
            const batches = currentInv
                .filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase())
                .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());

            for (const batch of batches) {
                if (toRestore <= 0) break;
                batch.quantity += toRestore;
                await db.updateMedicine(batch.id, { quantity: batch.quantity });
                toRestore = 0;
            }
        }
        const freshInv = await db.fetchInventory();
        setInventory(freshInv);
    }, [inventory]);

    const editRequestWithInventory = useCallback(async (id: string, updates: Partial<EmployeeRequest>) => {
        try {
            const existing = requests.find(r => r.id === id);
            if (!existing) return;

            const oldStatus = existing.status;
            const newStatus = updates.status || oldStatus;
            const oldItems = existing.items;
            const newItems = updates.items || oldItems;

            if (oldStatus === 'Approved' && newStatus !== 'Approved') {
                await restoreInventoryForItems(oldItems);
            } else if (oldStatus !== 'Approved' && newStatus === 'Approved') {
                await deductInventoryForItems(newItems);
            } else if (oldStatus === 'Approved' && newStatus === 'Approved' && updates.items) {
                await restoreInventoryForItems(oldItems);
                await deductInventoryForItems(newItems);
            }

            const updated = await db.updateRequest(id, updates);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
            showToast('Request updated successfully!');
        } catch (err) {
            console.error('Failed to edit request with inventory:', err);
            showToast('Failed to update request.', 'error');
        }
    }, [requests, deductInventoryForItems, restoreInventoryForItems, showToast]);

    const addManualApprovedRequest = useCallback(async (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => {
        try {
            await deductInventoryForItems(req.items);
            const newReq = await db.insertRequest(req, 'Approved');
            setRequests(prev => [newReq, ...prev]);
            showToast('Approved request added successfully!');
        } catch (err) {
            console.error('Failed to add approved request:', err);
            showToast('Failed to add request.', 'error');
        }
    }, [deductInventoryForItems, showToast]);

    const approveRequest = useCallback(async (requestId: string) => {
        const req = requests.find(r => r.id === requestId);
        if (!req || req.status !== 'Pending') return;

        try {
            await deductInventoryForItems(req.items);
            const updated = await db.updateRequest(requestId, { status: 'Approved' });
            setRequests(prev => prev.map(r => r.id === requestId ? updated : r));
            showToast('Request approved!');
        } catch (err) {
            console.error('Failed to approve request:', err);
            showToast('Failed to approve request.', 'error');
        }
    }, [requests, deductInventoryForItems, showToast]);

    const rejectRequest = useCallback(async (requestId: string) => {
        try {
            const updated = await db.updateRequest(requestId, { status: 'Rejected' });
            setRequests(prev => prev.map(r => r.id === requestId ? updated : r));
            showToast('Request rejected.');
        } catch (err) {
            console.error('Failed to reject request:', err);
            showToast('Failed to reject request.', 'error');
        }
    }, [showToast]);

    // ─── Medical Records ─────────────────────────────────────────────────────

    const addMedicalRecord = useCallback(async (record: Omit<MedicalRecord, 'id' | 'date'>) => {
        try {
            const newRecord = await db.insertMedicalRecord(record);
            setMedicalRecords(prev => [newRecord, ...prev]);

            // Deduct inventory for all medicines given
            if (record.medicineGiven && record.medicineGiven !== 'None' && record.medicineGiven !== '[]') {
                try {
                    const items: { medicineName: string; quantity: number }[] = JSON.parse(record.medicineGiven);
                    if (Array.isArray(items) && items.length > 0) {
                        await deductInventoryForItems(items);
                    }
                } catch {
                    // Legacy single-medicine string — deduct 1
                    await deductInventoryForItems([{ medicineName: record.medicineGiven, quantity: 1 }]);
                }
            }
            showToast('Medical record added successfully!');
        } catch (err) {
            console.error('Failed to add medical record:', err);
            showToast('Failed to add medical record.', 'error');
        }
    }, [deductInventoryForItems, showToast]);

    const editMedicalRecord = useCallback(async (id: string, updates: Partial<MedicalRecord>) => {
        try {
            const updated = await db.updateMedicalRecord(id, updates);
            setMedicalRecords(prev => prev.map(r => r.id === id ? updated : r));
            showToast('Medical record updated successfully!');
        } catch (err) {
            console.error('Failed to edit medical record:', err);
            showToast('Failed to update medical record.', 'error');
        }
    }, [showToast]);

    // ─── Employees ───────────────────────────────────────────────────────────

    const addEmployee = useCallback(async (emp: Omit<Employee, 'id'>) => {
        try {
            const newEmp = await db.insertEmployee(emp);
            setEmployees(prev => [...prev, newEmp]);
            showToast('Employee added successfully!');
        } catch (err) {
            console.error('Failed to add employee:', err);
            showToast('Failed to add employee.', 'error');
        }
    }, [showToast]);

    const editEmployee = useCallback(async (id: string, updates: Partial<Employee>) => {
        try {
            const updated = await db.updateEmployee(id, updates);
            setEmployees(prev => prev.map(e => e.id === id ? updated : e));
            showToast('Employee updated successfully!');
        } catch (err) {
            console.error('Failed to edit employee:', err);
            showToast('Failed to update employee.', 'error');
        }
    }, [showToast]);

    return (
        <AppContext.Provider value={{
            inventory, requests, medicalRecords, employees, disposedMedicines, loading,
            toasts, showToast, dismissToast,
            addMedicine, editMedicine, disposeMedicine,
            addRequest, addManualApprovedRequest, editRequest, editRequestWithInventory,
            addMedicalRecord, editMedicalRecord,
            addEmployee, editEmployee,
            approveRequest, rejectRequest,
            modalState, openModal, closeModal,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
