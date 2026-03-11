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

export interface RequestItem {
    medicineName: string;
    quantity: number;
}

export interface EmployeeRequest {
    id: string;
    employeeName: string;
    items: RequestItem[];
    reason: string;
    requestDate: string;
    status: RequestStatus;
}

export interface DisposedMedicine {
    id: string;
    scientificName: string;
    brand: string;
    milligrams: number;
    quantity: number;
    addedDate: string;
    expiryDate: string;
    disposedDate: string;
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
    medicalInfo?: {
        bloodType?: string;
        allergies?: string;
        preExistingConditions?: string;
        emergencyContact?: string;
    };
}

// Mock initial employee context
export const CURRENT_EMPLOYEE = "Juan Dela Cruz";
