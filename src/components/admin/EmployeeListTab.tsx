import { useState } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { PlusCircle, FileDown, Filter, FileText } from 'lucide-react';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EmployeeMedicalHistoryModal } from './EmployeeMedicalHistoryModal';
import { FilterModal } from '../ui/FilterModal';
import { exportToPdf } from '../../utils/exportPdf';
import type { Employee } from '../../types';

export const EmployeeListTab = () => {
    const { employees } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState('');

    // Filter and sort (alphabetically by name)
    const sortedEmployees = [...employees]
        .filter(emp => {
            if (!filterQuery) return true;
            const q = filterQuery.toLowerCase();
            return (
                emp.name.toLowerCase().includes(q) ||
                emp.contactNumber.includes(q) ||
                emp.address.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleExportPdf = () => {
        const headers = ['Name', 'Age', 'Gender', 'Contact Number', 'Address'];
        const data = sortedEmployees.map(emp => [
            emp.name,
            emp.age.toString(),
            emp.gender,
            emp.contactNumber,
            emp.address
        ]);

        exportToPdf({
            title: 'Employee Master List',
            headers,
            data,
            filename: 'employee_list_report'
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Employee List</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        Manage company employees and their medical records
                        {filterQuery && (
                            <Badge variant="default" className="ml-2 font-normal text-[10px] py-0 px-2 rounded-full">
                                Filtered: "{filterQuery}"
                            </Badge>
                        )}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="gap-2 w-full sm:w-auto text-slate-600">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button variant="outline" onClick={handleExportPdf} className="gap-2 w-full sm:w-auto text-slate-600">
                        <FileDown size={16} /> Export PDF
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-brand-blue hover:bg-brand-blue-dark w-full sm:w-auto">
                        <PlusCircle size={18} />
                        Add Employee
                    </Button>
                </div>
            </div>

            <Card className="p-0 border mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Name</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Age</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Gender</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Contact No.</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold">Address</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No employees found
                                    </td>
                                </tr>
                            ) : (
                                sortedEmployees.map((emp) => (
                                    <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 font-semibold text-slate-800">
                                            {emp.name}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm">
                                            {emp.age}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm">
                                            {emp.gender}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm">
                                            {emp.contactNumber}
                                        </td>
                                        <td className="py-3 px-6 text-slate-600 text-sm truncate max-w-[200px]" title={emp.address}>
                                            {emp.address}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1.5 text-brand-blue border-brand-blue-200 hover:bg-brand-blue-50 w-full sm:w-auto justify-center"
                                                onClick={() => setSelectedEmployee(emp)}
                                            >
                                                <FileText size={14} />
                                                View <span className="hidden sm:inline">Records</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EmployeeMedicalHistoryModal isOpen={selectedEmployee !== null} onClose={() => setSelectedEmployee(null)} employee={selectedEmployee} />
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(q) => setFilterQuery(q)}
                onReset={() => setFilterQuery('')}
                currentQuery={filterQuery}
            />
        </div>
    );
};
