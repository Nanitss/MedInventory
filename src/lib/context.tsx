import React, { createContext, useContext, useEffect, useState } from 'react';
import type { MedicineBatch, EmployeeRequest, MedicalRecord, Employee } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

interface AppContextType {
    inventory: MedicineBatch[];
    requests: EmployeeRequest[];
    medicalRecords: MedicalRecord[];
    employees: Employee[];

    addMedicine: (med: Omit<MedicineBatch, 'id' | 'addedDate'>) => void;
    addRequest: (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => void;
    addManualApprovedRequest: (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => void;
    addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => void;
    addEmployee: (emp: Omit<Employee, 'id'>) => void;
    approveRequest: (requestId: string) => void;
    rejectRequest: (requestId: string) => void;
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
    { id: uuidv4(), employeeName: 'Juan Dela Cruz', date: subDays(new Date(), 2).toISOString(), temperature: 37.1, systolic: 122, diastolic: 82, pulseRate: '80', remarks: 'Slight fever reported.', medicineGiven: 'Paracetamol 500mg' },
];

const INITIAL_EMPLOYEES: Employee[] = [
    { id: uuidv4(), name: 'Juan Dela Cruz', contactNumber: '0917-123-4567', address: '123 Rizal St, Baliwag, Bulacan', gender: 'Male', age: 30 },
    { id: uuidv4(), name: 'Maria Santos', contactNumber: '0918-987-6543', address: '456 Bonifacio Ave, Baliwag, Bulacan', gender: 'Female', age: 28 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = useState<MedicineBatch[]>(() => {
        const saved = localStorage.getItem('bwd_inventory');
        return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    });

    const [requests, setRequests] = useState<EmployeeRequest[]>(() => {
        const saved = localStorage.getItem('bwd_requests');
        return saved ? JSON.parse(saved) : [];
    });

    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
        const saved = localStorage.getItem('bwd_medical_records_v3');
        return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    });

    const [employees, setEmployees] = useState<Employee[]>(() => {
        const saved = localStorage.getItem('bwd_employees');
        return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    });

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

    // Actions
    const addMedicine = (med: Omit<MedicineBatch, 'id' | 'addedDate'>) => {
        const newMed: MedicineBatch = {
            ...med,
            id: uuidv4(),
            addedDate: new Date().toISOString(),
        };
        setInventory(prev => [...prev, newMed]);
    };

    const addRequest = (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => {
        const newReq: EmployeeRequest = {
            ...req,
            id: uuidv4(),
            requestDate: new Date().toISOString(),
            status: 'Pending',
        };
        setRequests(prev => [...prev, newReq]);
    };

    const addManualApprovedRequest = (req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>) => {
        let assignedBatchId: string | undefined = undefined;

        // Find the oldest available batch for the requested medicine to deduct stock
        const matchingBatches = inventory
            .filter(b => b.scientificName.toLowerCase() === req.medicineRequested.toLowerCase() && b.quantity > 0)
            .sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime());

        if (matchingBatches.length > 0) {
            const oldestBatch = matchingBatches[0];
            assignedBatchId = oldestBatch.id;

            // Update inventory
            setInventory(prevInv => prevInv.map(b =>
                b.id === oldestBatch.id ? { ...b, quantity: b.quantity - 1 } : b
            ));
        }

        const newReq: EmployeeRequest = {
            ...req,
            id: uuidv4(),
            requestDate: new Date().toISOString(),
            status: 'Approved',
            assignedBatchId
        };
        setRequests(prev => [...prev, newReq]);
    };

    const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'date'>) => {
        const newRecord: MedicalRecord = {
            ...record,
            id: uuidv4(),
            date: new Date().toISOString(),
        };
        setMedicalRecords(prev => [...prev, newRecord]);
    };

    const addEmployee = (emp: Omit<Employee, 'id'>) => {
        const newEmp: Employee = {
            ...emp,
            id: uuidv4()
        };
        setEmployees(prev => [...prev, newEmp]);
    };

    const approveRequest = (requestId: string) => {
        setRequests(prevReqs => {
            const copy = [...prevReqs];
            const reqIndex = copy.findIndex(r => r.id === requestId);
            if (reqIndex === -1 || copy[reqIndex].status !== 'Pending') return copy;

            const req = copy[reqIndex];
            // Find the oldest available batch for the requested medicine
            const matchingBatches = inventory
                .filter(b => b.scientificName.toLowerCase() === req.medicineRequested.toLowerCase() && b.quantity > 0)
                .sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime());

            if (matchingBatches.length > 0) {
                const oldestBatch = matchingBatches[0];

                // Update inventory
                setInventory(prevInv => prevInv.map(b =>
                    b.id === oldestBatch.id ? { ...b, quantity: b.quantity - 1 } : b
                ));

                copy[reqIndex] = { ...req, status: 'Approved', assignedBatchId: oldestBatch.id };
            } else {
                // Edge case: No stock left. Reject it automatically.
                copy[reqIndex] = { ...req, status: 'Rejected' };
            }
            return copy;
        });
    };

    const rejectRequest = (requestId: string) => {
        setRequests(prev => prev.map(r =>
            r.id === requestId ? { ...r, status: 'Rejected' } : r
        ));
    };

    return (
        <AppContext.Provider value={{ inventory, requests, medicalRecords, employees, addMedicine, addRequest, addManualApprovedRequest, addMedicalRecord, addEmployee, approveRequest, rejectRequest }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
