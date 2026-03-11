import React, { createContext, useContext, useEffect, useState } from 'react';
import type { MedicineBatch, EmployeeRequest, MedicalRecord, Employee, RequestItem, DisposedMedicine } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

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
    openModal: (type: ModalType, data?: any) => void;
    closeModal: () => void;

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

// Initial Mock Data
const INITIAL_INVENTORY: MedicineBatch[] = [
    {
        id: uuidv4(),
        scientificName: 'Paracetamol',
        brand: 'Biogesic',
        milligrams: 500,
        addedDate: subDays(new Date(), 30).toISOString(),
        expiryDate: addDays(new Date(), 400).toISOString(),
        illness: 'Fever, Headache',
        quantity: 100,
    },
    {
        id: uuidv4(),
        scientificName: 'Amoxicillin',
        brand: 'Amoxil',
        milligrams: 250,
        addedDate: subDays(new Date(), 20).toISOString(),
        expiryDate: addDays(new Date(), 15).toISOString(), // Expiring soon!
        illness: 'Bacterial Infection',
        quantity: 50,
    },
    {
        id: uuidv4(),
        scientificName: 'Loratadine',
        brand: 'Claritin',
        milligrams: 10,
        addedDate: subDays(new Date(), 60).toISOString(),
        expiryDate: subDays(new Date(), 5).toISOString(), // Already Expired!
        illness: 'Allergies',
        quantity: 20,
    }
];

const INITIAL_RECORDS: MedicalRecord[] = [
    { id: uuidv4(), employeeName: 'Juan Dela Cruz', date: subDays(new Date(), 30).toISOString(), temperature: 36.5, systolic: 120, diastolic: 80, pulseRate: '72', remarks: 'Routine checkup. Overall healthy.', medicineGiven: 'None' },
    { id: uuidv4(), employeeName: 'Juan Dela Cruz', date: subDays(new Date(), 15).toISOString(), temperature: 36.8, systolic: 118, diastolic: 79, pulseRate: '75', remarks: 'Complained of mild fatigue.', medicineGiven: 'Vitamins' },
    { id: uuidv4(), employeeName: 'Juan Dela Cruz', date: subDays(new Date(), 4).toISOString(), temperature: 37.1, systolic: 145, diastolic: 95, pulseRate: '80', remarks: 'High BP recorded.', medicineGiven: 'Losartan 50mg' },
    { id: uuidv4(), employeeName: 'Juan Dela Cruz', date: subDays(new Date(), 3).toISOString(), temperature: 36.9, systolic: 142, diastolic: 92, pulseRate: '78', remarks: 'Follow up, BP still high.', medicineGiven: 'None' },
    { id: uuidv4(), employeeName: 'Juan Dela Cruz', date: subDays(new Date(), 2).toISOString(), temperature: 37.0, systolic: 150, diastolic: 100, pulseRate: '85', remarks: 'BP elevated.', medicineGiven: 'Amlodipine 10mg' },
    { id: uuidv4(), employeeName: 'Maria Santos', date: subDays(new Date(), 1).toISOString(), temperature: 38.5, systolic: 110, diastolic: 70, pulseRate: '95', remarks: 'Feverish.', medicineGiven: 'Paracetamol 500mg' },
    { id: uuidv4(), employeeName: 'Maria Santos', date: subDays(new Date(), 2).toISOString(), temperature: 38.2, systolic: 112, diastolic: 72, pulseRate: '92', remarks: 'Feverish.', medicineGiven: 'Paracetamol 500mg' },
    { id: uuidv4(), employeeName: 'Maria Santos', date: subDays(new Date(), 3).toISOString(), temperature: 37.9, systolic: 115, diastolic: 75, pulseRate: '90', remarks: 'Feverish.', medicineGiven: 'None' },
];

const INITIAL_EMPLOYEES: Employee[] = [
    {
        id: uuidv4(),
        name: 'Juan Dela Cruz',
        contactNumber: '0917-123-4567',
        address: '123 Rizal St, Baliwag, Bulacan',
        gender: 'Male',
        age: 30,
        medicalInfo: {
            bloodType: 'O+',
            allergies: 'None',
            preExistingConditions: 'Hypertension',
            emergencyContact: 'Maria Cruz (Wife) - 0917-999-8888'
        }
    },
    {
        id: uuidv4(),
        name: 'Maria Santos',
        contactNumber: '0918-987-6543',
        address: '456 Bonifacio Ave, Baliwag, Bulacan',
        gender: 'Female',
        age: 28,
        medicalInfo: {
            bloodType: 'A-',
            allergies: 'Penicillin, Dust',
            preExistingConditions: 'Asthma',
            emergencyContact: 'Pedro Santos (Brother) - 0918-777-6666'
        }
    },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = useState<MedicineBatch[]>(() => {
        const saved = localStorage.getItem('bwd_inventory');
        return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    });

    const [requests, setRequests] = useState<EmployeeRequest[]>(() => {
        const saved = localStorage.getItem('bwd_requests');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migrate legacy requests (from medicineRequested -> items)
            return parsed.map((req: any) => {
                if (!req.items && req.medicineRequested) {
                    return { ...req, items: [{ medicineName: req.medicineRequested, quantity: 1 }] };
                }
                return req;
            });
        }
        return [];
    });

    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
        const saved = localStorage.getItem('bwd_medical_records_v3');
        return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    });

    const [employees, setEmployees] = useState<Employee[]>(() => {
        const saved = localStorage.getItem('bwd_employees');
        return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    });

    const [disposedMedicines, setDisposedMedicines] = useState<DisposedMedicine[]>(() => {
        const saved = localStorage.getItem('bwd_disposed_medicines');
        return saved ? JSON.parse(saved) : [];
    });

    const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });

    const openModal = (type: ModalType, data?: any) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: 'NONE' });
    };

    useEffect(() => {
        localStorage.setItem('bwd_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('bwd_requests', JSON.stringify(requests));
    }, [requests]);

    useEffect(() => {
        localStorage.setItem('bwd_medical_records_v3', JSON.stringify(medicalRecords));
    }, [medicalRecords]);

    useEffect(() => {
        localStorage.setItem('bwd_employees', JSON.stringify(employees));
    }, [employees]);

    useEffect(() => {
        localStorage.setItem('bwd_disposed_medicines', JSON.stringify(disposedMedicines));
    }, [disposedMedicines]);

    // Actions
    const addMedicine = (med: Omit<MedicineBatch, 'id' | 'addedDate'>) => {
        const newMed: MedicineBatch = { ...med, id: uuidv4(), addedDate: new Date().toISOString() };
        setInventory(prev => [...prev, newMed]);
    };

    const editMedicine = (id: string, updates: Partial<MedicineBatch>) => {
        setInventory(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const disposeMedicine = (id: string, qty: number) => {
        const batch = inventory.find(m => m.id === id);
        if (!batch) return;

        const disposed: DisposedMedicine = {
            id: uuidv4(),
            scientificName: batch.scientificName,
            brand: batch.brand,
            milligrams: batch.milligrams,
            quantity: qty,
            addedDate: batch.addedDate,
            expiryDate: batch.expiryDate,
            disposedDate: new Date().toISOString()
        };
        setDisposedMedicines(d => [...d, disposed]);

        setInventory(prev => {
            return prev.map(m => m.id === id ? { ...m, quantity: Math.max(0, m.quantity - qty) } : m).filter(m => m.quantity > 0);
        });
    };

    const addRequest = (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => {
        const newReq: EmployeeRequest = { ...req, id: uuidv4(), requestDate: new Date().toISOString(), status: 'Pending' };
        setRequests(prev => [...prev, newReq]);
    };

    const editRequest = (id: string, updates: Partial<EmployeeRequest>) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    // Reconciles inventory when editing a request
    const editRequestWithInventory = (id: string, updates: Partial<EmployeeRequest>) => {
        setRequests(prevReqs => {
            const existing = prevReqs.find(r => r.id === id);
            if (!existing) return prevReqs;

            const oldStatus = existing.status;
            const newStatus = updates.status || oldStatus;
            const oldItems = existing.items;
            const newItems = updates.items || oldItems;

            setInventory(prevInv => {
                let nextInv = prevInv.map(b => ({ ...b }));

                // Case 1: Was Approved, now NOT Approved (Restore all old items)
                if (oldStatus === 'Approved' && newStatus !== 'Approved') {
                    for (const item of oldItems) {
                        let toRestore = item.quantity;
                        for (const batch of nextInv.filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase()).sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())) {
                            if (toRestore <= 0) break;
                            batch.quantity += toRestore;
                            toRestore = 0;
                        }
                    }
                }
                // Case 2: Was NOT Approved, now Approved (Deduct all new items)
                else if (oldStatus !== 'Approved' && newStatus === 'Approved') {
                    for (const item of newItems) {
                        let remaining = item.quantity;
                        for (const batch of nextInv.filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase() && b.quantity > 0).sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())) {
                            if (remaining <= 0) break;
                            const deduct = Math.min(batch.quantity, remaining);
                            batch.quantity -= deduct;
                            remaining -= deduct;
                        }
                    }
                }
                // Case 3: Was Approved, staying Approved, but items changed (Restore old, deduct new)
                else if (oldStatus === 'Approved' && newStatus === 'Approved' && updates.items) {
                    // Restore old
                    for (const item of oldItems) {
                        let toRestore = item.quantity;
                        for (const batch of nextInv.filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase()).sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())) {
                            if (toRestore <= 0) break;
                            batch.quantity += toRestore;
                            toRestore = 0;
                        }
                    }
                    // Deduct new
                    for (const item of newItems) {
                        let remaining = item.quantity;
                        for (const batch of nextInv.filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase() && b.quantity > 0).sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())) {
                            if (remaining <= 0) break;
                            const deduct = Math.min(batch.quantity, remaining);
                            batch.quantity -= deduct;
                            remaining -= deduct;
                        }
                    }
                }

                return nextInv;
            });

            return prevReqs.map(r => r.id === id ? { ...r, ...updates } : r);
        });
    };

    // Helper logic to deduct items from inventory FIFO
    const processInventoryDeduction = (items: RequestItem[]) => {
        setInventory(prevInv => {
            let nextInv = [...prevInv];
            for (const item of items) {
                let remainingToDeduct = item.quantity;
                // Get batches for this medicine, oldest first
                const batches = nextInv
                    .filter(b => b.scientificName.toLowerCase() === item.medicineName.toLowerCase() && b.quantity > 0)
                    .sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime());

                for (const batch of batches) {
                    if (remainingToDeduct <= 0) break;
                    const deduction = Math.min(batch.quantity, remainingToDeduct);
                    batch.quantity -= deduction;
                    remainingToDeduct -= deduction;
                }
            }
            return nextInv;
        });
    };

    const addManualApprovedRequest = (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => {
        processInventoryDeduction(req.items);
        const newReq: EmployeeRequest = { ...req, id: uuidv4(), requestDate: new Date().toISOString(), status: 'Approved' };
        setRequests(prev => [...prev, newReq]);
    };

    const approveRequest = (requestId: string) => {
        setRequests(prevReqs => {
            const copy = [...prevReqs];
            const reqIndex = copy.findIndex(r => r.id === requestId);
            if (reqIndex === -1 || copy[reqIndex].status !== 'Pending') return copy;

            const req = copy[reqIndex];
            processInventoryDeduction(req.items);

            copy[reqIndex] = { ...req, status: 'Approved' };
            return copy;
        });
    };

    const rejectRequest = (requestId: string) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
    };

    const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'date'>) => {
        const newRecord: MedicalRecord = { ...record, id: uuidv4(), date: new Date().toISOString() };
        setMedicalRecords(prev => [...prev, newRecord]);

        if (record.medicineGiven && record.medicineGiven !== 'None') {
            processInventoryDeduction([{ medicineName: record.medicineGiven, quantity: 1 }]);
        }
    };

    const editMedicalRecord = (id: string, updates: Partial<MedicalRecord>) => {
        setMedicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const addEmployee = (emp: Omit<Employee, 'id'>) => {
        const newEmp: Employee = { ...emp, id: uuidv4() };
        setEmployees(prev => [...prev, newEmp]);
    };

    const editEmployee = (id: string, updates: Partial<Employee>) => {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    return (
        <AppContext.Provider value={{ inventory, requests, medicalRecords, employees, disposedMedicines, addMedicine, editMedicine, disposeMedicine, addRequest, addManualApprovedRequest, editRequest, editRequestWithInventory, addMedicalRecord, editMedicalRecord, addEmployee, editEmployee, approveRequest, rejectRequest, modalState, openModal, closeModal }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
