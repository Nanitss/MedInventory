import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../lib/context';
import { Button, Card, Badge } from '../ui/primitives';
import { PlusCircle, FileDown, Filter, FileText, Edit3, MoreVertical, Pill } from 'lucide-react';
import { FilterModal, type FilterField } from '../ui/FilterModal';
import { exportToPdf } from '../../utils/exportPdf';
import { createPortal } from 'react-dom';

const ActionMenu = ({ emp, openModal }: { emp: any, openModal: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + 4,
                left: rect.right - 192, // 192px = w-48
            });
        }
    }, [isOpen]);

    return (
        <>
            <Button ref={btnRef} variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100"><MoreVertical size={16} /></Button>
            {isOpen && createPortal(
                <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)}></div>
                    <div className="fixed w-48 bg-white border border-slate-200 shadow-lg rounded-md overflow-hidden z-[91]" style={{ top: menuPos.top, left: menuPos.left }}>
                        <button onClick={() => { openModal('VIEW_MEDICAL_HISTORY', emp); setIsOpen(false); }} className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-50"><FileText size={14} /> Consultations</button>
                        <button onClick={() => { openModal('VIEW_MEDICAL_INFO', emp); setIsOpen(false); }} className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-50"><FileText size={14} /> Medical Info</button>
                        <button onClick={() => { openModal('VIEW_GIVEN_MEDICINES', emp); setIsOpen(false); }} className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-50"><Pill size={14} /> Given Medicines</button>
                        <button onClick={() => { openModal('EDIT_EMPLOYEE', emp); setIsOpen(false); }} className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-brand-blue hover:bg-brand-blue-50 border-t border-slate-100"><Edit3 size={14} /> Edit Employee</button>
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

export const EmployeeListTab = () => {
    const { employees, openModal } = useAppContext();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const uniqueNames = Array.from(new Set(employees.map(e => e.name))).sort();
    const uniqueAddresses = Array.from(new Set(employees.map(e => e.address))).sort();

    const filterFields: FilterField[] = [
        { key: 'name', label: 'Employee Name', type: 'select', options: uniqueNames },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { key: 'address', label: 'Address / Branch', type: 'select', options: uniqueAddresses }
    ];

    // Filter and sort (alphabetically by name)
    const sortedEmployees = [...employees]
        .filter(emp => {
            const matchName = !filters.name || emp.name === filters.name;
            const matchGender = !filters.gender || emp.gender === filters.gender;
            const matchAddress = !filters.address || emp.address === filters.address;

            return matchName && matchGender && matchAddress;
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
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500">Manage company employees and their medical records</p>
                        {Object.keys(filters).length > 0 && (
                            <Badge variant="default" className="font-normal text-[10px] py-0 px-2 rounded-full">
                                {Object.keys(filters).length} Filter(s) Applied
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="gap-2 w-full sm:w-auto text-slate-600">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button variant="outline" onClick={handleExportPdf} className="gap-2 w-full sm:w-auto text-slate-600">
                        <FileDown size={16} /> Export PDF
                    </Button>
                    <Button onClick={() => openModal('ADD_EMPLOYEE')} className="gap-2 bg-brand-blue hover:bg-brand-blue-dark w-full sm:w-auto">
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
                                <th className="py-3 px-3 sm:py-4 sm:px-6 font-semibold text-center w-24">Actions</th>
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
                                            <div className="flex items-center justify-center">
                                                <ActionMenu emp={emp} openModal={openModal} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(f) => setFilters(f)}
                onReset={() => setFilters({})}
                fields={filterFields}
                currentFilters={filters}
            />
        </div>
    );
};
