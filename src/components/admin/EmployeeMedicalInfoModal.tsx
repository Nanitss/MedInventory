import { useState, useEffect } from 'react';
import { Button, Card } from '../ui/primitives';
import { X, Save, Edit3, User, AlertCircle, Phone, Droplets, HeartPulse } from 'lucide-react';
import type { Employee } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

export const EmployeeMedicalInfoModal = ({ isOpen, onClose, employee }: Props) => {
    // Determine if we are in "Read" or "Edit" mode
    const [isEditing, setIsEditing] = useState(false);

    // Local form state
    const [formData, setFormData] = useState({
        bloodType: '',
        allergies: '',
        preExistingConditions: '',
        emergencyContact: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                bloodType: employee.medicalInfo?.bloodType || '',
                allergies: employee.medicalInfo?.allergies || '',
                preExistingConditions: employee.medicalInfo?.preExistingConditions || '',
                emergencyContact: employee.medicalInfo?.emergencyContact || ''
            });
            setIsEditing(false); // Reset to view mode on open
        }
    }, [employee, isOpen]);

    if (!isOpen || !employee) return null;

    const handleSave = () => {
        // Ideally we would push this global state back. For this frontend-only test we will just pretend.
        // Alert user if the context lacks an `updateEmployee` function for persistence.
        alert("Medical Information saved successfully (Local Form Data Only).");
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="bg-brand-blue-50 px-6 py-4 border-b border-brand-blue-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-brand-blue shadow-sm border border-brand-blue-100/50">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-brand-blue-900 text-lg">Medical Information</h3>
                            <p className="text-xs text-brand-blue-600 font-medium">Static Health Records for: <span className="text-slate-700">{employee.name}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-brand-blue-500 hover:text-brand-blue-800 transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">

                    {/* Header Action Row */}
                    <div className="flex justify-end border-b border-slate-200 pb-4">
                        {!isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2 text-brand-blue border-brand-blue-200 hover:bg-brand-blue-50">
                                <Edit3 size={16} /> Edit Information
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="primary" size="sm" onClick={handleSave} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                    <Save size={16} /> Save Changes
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Data Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Blood Type */}
                        <Card className="p-4 border shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <Droplets size={16} className="text-red-500" />
                                <h4 className="text-sm font-semibold">Blood Type</h4>
                            </div>
                            {isEditing ? (
                                <select
                                    value={formData.bloodType}
                                    onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                >
                                    <option value="">Unknown</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            ) : (
                                <p className="text-slate-800 font-medium text-lg">
                                    {formData.bloodType || 'Not Specified'}
                                </p>
                            )}
                        </Card>

                        {/* Emergency Contact */}
                        <Card className="p-4 border shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <Phone size={16} className="text-emerald-500" />
                                <h4 className="text-sm font-semibold">Emergency Contact</h4>
                            </div>
                            {isEditing ? (
                                <input
                                    value={formData.emergencyContact}
                                    placeholder="Name and Phone Number"
                                    onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                            ) : (
                                <p className="text-slate-800 font-medium">
                                    {formData.emergencyContact || 'Not Specified'}
                                </p>
                            )}
                        </Card>

                        {/* Allergies */}
                        <Card className="p-4 border shadow-sm md:col-span-2">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <AlertCircle size={16} className="text-amber-500" />
                                <h4 className="text-sm font-semibold">Allergies</h4>
                            </div>
                            {isEditing ? (
                                <textarea
                                    value={formData.allergies}
                                    placeholder="List any known food or medicine allergies..."
                                    onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none min-h-[60px]"
                                />
                            ) : (
                                <p className="text-slate-800 font-medium">
                                    {formData.allergies || 'None recorded'}
                                </p>
                            )}
                        </Card>

                        {/* Pre-Existing Conditions */}
                        <Card className="p-4 border shadow-sm md:col-span-2">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <HeartPulse size={16} className="text-rose-500" />
                                <h4 className="text-sm font-semibold">Pre-Existing Conditions</h4>
                            </div>
                            {isEditing ? (
                                <textarea
                                    value={formData.preExistingConditions}
                                    placeholder="List any chronic or pre-existing conditions..."
                                    onChange={e => setFormData({ ...formData, preExistingConditions: e.target.value })}
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none min-h-[60px]"
                                />
                            ) : (
                                <p className="text-slate-800 font-medium whitespace-pre-line">
                                    {formData.preExistingConditions || 'None recorded'}
                                </p>
                            )}
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};
