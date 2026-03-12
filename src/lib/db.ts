import { supabase } from './supabase';
import type { MedicineBatch, EmployeeRequest, MedicalRecord, Employee, DisposedMedicine, RequestItem } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Maps a snake_case DB row to our camelCase MedicineBatch type */
const toMedicineBatch = (row: any): MedicineBatch => ({
    id: row.id,
    scientificName: row.scientific_name,
    brand: row.brand,
    milligrams: row.milligrams,
    addedDate: row.added_date,
    expiryDate: row.expiry_date,
    illness: row.illness,
    quantity: row.quantity,
});

const toEmployee = (row: any): Employee => ({
    id: row.id,
    name: row.name,
    contactNumber: row.contact_number,
    address: row.address,
    gender: row.gender,
    age: row.age,
    medicalInfo: {
        bloodType: row.blood_type || '',
        allergies: row.allergies || '',
        preExistingConditions: row.pre_existing_conditions || '',
        emergencyContact: row.emergency_contact || '',
    },
});

const toMedicalRecord = (row: any): MedicalRecord => ({
    id: row.id,
    employeeName: row.employee_name,
    date: row.date,
    temperature: Number(row.temperature),
    systolic: row.systolic,
    diastolic: row.diastolic,
    pulseRate: row.pulse_rate,
    remarks: row.remarks,
    medicineGiven: row.medicine_given,
});

const toDisposedMedicine = (row: any): DisposedMedicine => ({
    id: row.id,
    scientificName: row.scientific_name,
    brand: row.brand,
    milligrams: row.milligrams,
    quantity: row.quantity,
    addedDate: row.added_date,
    expiryDate: row.expiry_date,
    disposedDate: row.disposed_date,
});

const toEmployeeRequest = (row: any): EmployeeRequest => ({
    id: row.id,
    employeeName: row.employee_name,
    items: (row.request_items || []).map((ri: any) => ({
        medicineName: ri.medicine_name,
        quantity: ri.quantity,
    })),
    reason: row.reason,
    requestDate: row.request_date,
    status: row.status,
});

// ─── Medicine Batches (Inventory) ───────────────────────────────────────────

export async function fetchInventory(): Promise<MedicineBatch[]> {
    const { data, error } = await supabase
        .from('medicine_batches')
        .select('*')
        .order('added_date', { ascending: false });
    if (error) throw error;
    return (data || []).map(toMedicineBatch);
}

export async function insertMedicine(med: Omit<MedicineBatch, 'id' | 'addedDate'>): Promise<MedicineBatch> {
    const { data, error } = await supabase
        .from('medicine_batches')
        .insert({
            scientific_name: med.scientificName,
            brand: med.brand,
            milligrams: med.milligrams,
            expiry_date: med.expiryDate,
            illness: med.illness,
            quantity: med.quantity,
        })
        .select()
        .single();
    if (error) throw error;
    return toMedicineBatch(data);
}

export async function updateMedicine(id: string, updates: Partial<MedicineBatch>): Promise<MedicineBatch> {
    const payload: any = {};
    if (updates.scientificName !== undefined) payload.scientific_name = updates.scientificName;
    if (updates.brand !== undefined) payload.brand = updates.brand;
    if (updates.milligrams !== undefined) payload.milligrams = updates.milligrams;
    if (updates.expiryDate !== undefined) payload.expiry_date = updates.expiryDate;
    if (updates.illness !== undefined) payload.illness = updates.illness;
    if (updates.quantity !== undefined) payload.quantity = updates.quantity;

    const { data, error } = await supabase
        .from('medicine_batches')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return toMedicineBatch(data);
}

export async function deleteMedicine(id: string): Promise<void> {
    const { error } = await supabase
        .from('medicine_batches')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// ─── Disposed Medicines ─────────────────────────────────────────────────────

export async function fetchDisposedMedicines(): Promise<DisposedMedicine[]> {
    const { data, error } = await supabase
        .from('disposed_medicines')
        .select('*')
        .order('disposed_date', { ascending: false });
    if (error) throw error;
    return (data || []).map(toDisposedMedicine);
}

export async function insertDisposedMedicine(med: Omit<DisposedMedicine, 'id'>): Promise<DisposedMedicine> {
    const { data, error } = await supabase
        .from('disposed_medicines')
        .insert({
            scientific_name: med.scientificName,
            brand: med.brand,
            milligrams: med.milligrams,
            quantity: med.quantity,
            added_date: med.addedDate,
            expiry_date: med.expiryDate,
            disposed_date: med.disposedDate,
        })
        .select()
        .single();
    if (error) throw error;
    return toDisposedMedicine(data);
}

// ─── Employee Requests ──────────────────────────────────────────────────────

export async function fetchRequests(): Promise<EmployeeRequest[]> {
    const { data, error } = await supabase
        .from('employee_requests')
        .select('*, request_items(*)')
        .order('request_date', { ascending: false });
    if (error) throw error;
    return (data || []).map(toEmployeeRequest);
}

export async function insertRequest(
    req: Omit<EmployeeRequest, 'id' | 'requestDate' | 'status'>,
    status: string = 'Pending'
): Promise<EmployeeRequest> {
    // Insert the request header
    const { data: reqData, error: reqError } = await supabase
        .from('employee_requests')
        .insert({
            employee_name: req.employeeName,
            reason: req.reason,
            status: status,
        })
        .select()
        .single();
    if (reqError) throw reqError;

    // Insert line items
    if (req.items && req.items.length > 0) {
        const items = req.items.map((item: RequestItem) => ({
            request_id: reqData.id,
            medicine_name: item.medicineName,
            quantity: item.quantity,
        }));
        const { error: itemsError } = await supabase
            .from('request_items')
            .insert(items);
        if (itemsError) throw itemsError;
    }

    // Re-fetch to get items joined
    const { data: full, error: fetchError } = await supabase
        .from('employee_requests')
        .select('*, request_items(*)')
        .eq('id', reqData.id)
        .single();
    if (fetchError) throw fetchError;
    return toEmployeeRequest(full);
}

export async function updateRequest(id: string, updates: Partial<EmployeeRequest>): Promise<EmployeeRequest> {
    const payload: any = {};
    if (updates.employeeName !== undefined) payload.employee_name = updates.employeeName;
    if (updates.reason !== undefined) payload.reason = updates.reason;
    if (updates.status !== undefined) payload.status = updates.status;

    if (Object.keys(payload).length > 0) {
        const { error } = await supabase
            .from('employee_requests')
            .update(payload)
            .eq('id', id);
        if (error) throw error;
    }

    // If items are being updated, replace them
    if (updates.items) {
        // Delete old items
        const { error: delErr } = await supabase
            .from('request_items')
            .delete()
            .eq('request_id', id);
        if (delErr) throw delErr;

        // Insert new items
        if (updates.items.length > 0) {
            const items = updates.items.map((item: RequestItem) => ({
                request_id: id,
                medicine_name: item.medicineName,
                quantity: item.quantity,
            }));
            const { error: insErr } = await supabase
                .from('request_items')
                .insert(items);
            if (insErr) throw insErr;
        }
    }

    // Re-fetch full record
    const { data: full, error: fetchError } = await supabase
        .from('employee_requests')
        .select('*, request_items(*)')
        .eq('id', id)
        .single();
    if (fetchError) throw fetchError;
    return toEmployeeRequest(full);
}

// ─── Medical Records ────────────────────────────────────────────────────────

export async function fetchMedicalRecords(): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(toMedicalRecord);
}

export async function insertMedicalRecord(record: Omit<MedicalRecord, 'id' | 'date'>): Promise<MedicalRecord> {
    const { data, error } = await supabase
        .from('medical_records')
        .insert({
            employee_name: record.employeeName,
            temperature: record.temperature,
            systolic: record.systolic,
            diastolic: record.diastolic,
            pulse_rate: record.pulseRate,
            remarks: record.remarks,
            medicine_given: record.medicineGiven,
        })
        .select()
        .single();
    if (error) throw error;
    return toMedicalRecord(data);
}

export async function updateMedicalRecord(id: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const payload: any = {};
    if (updates.employeeName !== undefined) payload.employee_name = updates.employeeName;
    if (updates.temperature !== undefined) payload.temperature = updates.temperature;
    if (updates.systolic !== undefined) payload.systolic = updates.systolic;
    if (updates.diastolic !== undefined) payload.diastolic = updates.diastolic;
    if (updates.pulseRate !== undefined) payload.pulse_rate = updates.pulseRate;
    if (updates.remarks !== undefined) payload.remarks = updates.remarks;
    if (updates.medicineGiven !== undefined) payload.medicine_given = updates.medicineGiven;

    const { data, error } = await supabase
        .from('medical_records')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return toMedicalRecord(data);
}

// ─── Employees ──────────────────────────────────────────────────────────────

export async function fetchEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });
    if (error) throw error;
    return (data || []).map(toEmployee);
}

export async function insertEmployee(emp: Omit<Employee, 'id'>): Promise<Employee> {
    const { data, error } = await supabase
        .from('employees')
        .insert({
            name: emp.name,
            contact_number: emp.contactNumber,
            address: emp.address,
            gender: emp.gender,
            age: emp.age,
            blood_type: emp.medicalInfo?.bloodType || '',
            allergies: emp.medicalInfo?.allergies || '',
            pre_existing_conditions: emp.medicalInfo?.preExistingConditions || '',
            emergency_contact: emp.medicalInfo?.emergencyContact || '',
        })
        .select()
        .single();
    if (error) throw error;
    return toEmployee(data);
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.contactNumber !== undefined) payload.contact_number = updates.contactNumber;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.gender !== undefined) payload.gender = updates.gender;
    if (updates.age !== undefined) payload.age = updates.age;
    if (updates.medicalInfo) {
        if (updates.medicalInfo.bloodType !== undefined) payload.blood_type = updates.medicalInfo.bloodType;
        if (updates.medicalInfo.allergies !== undefined) payload.allergies = updates.medicalInfo.allergies;
        if (updates.medicalInfo.preExistingConditions !== undefined) payload.pre_existing_conditions = updates.medicalInfo.preExistingConditions;
        if (updates.medicalInfo.emergencyContact !== undefined) payload.emergency_contact = updates.medicalInfo.emergencyContact;
    }

    const { data, error } = await supabase
        .from('employees')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return toEmployee(data);
}
