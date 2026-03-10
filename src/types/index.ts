export interface MedicineBatch {
    id: string;
    scientificName: string;
    brand: string;
    milligrams: number;
    addedDate: string; // ISO Date string
    expiryDate: string; // ISO Date string
    illness: string;
    quantity: number;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface EmployeeRequest {
    id: string;
    employeeName: string;
    medicineRequested: string; // e.g., "Paracetamol" or "Amoxicillin"
    reason: string;
    requestDate: string;
    status: RequestStatus;
    assignedBatchId?: string; // the batch from which it was subtracted
}

export interface MedicalRecord {
    id: string;
    employeeName: string;
    date: string;
    temperature: number; // Celsius
    systolic: number;
    diastolic: number;
    pulseRate: string;
    remarks: string;
    medicineGiven: string;
}

export interface Employee {
    id: string;
    name: string;
    contactNumber: string;
    address: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
}

// Mock initial employee context
export const CURRENT_EMPLOYEE = "Juan Dela Cruz";
