import { useState } from 'react';
import { InventoryTable } from '../components/admin/InventoryTable.tsx';
import { RequestsTab } from '../components/admin/RequestsTab.tsx';
import { EmployeeRecordsTab } from '../components/admin/EmployeeRecordsTab.tsx';
import { Button } from '../components/ui/primitives';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'records'>('inventory');

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h2>
                    <p className="text-sm text-slate-500">Manage medicine inventory and employee requests</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <Button
                        variant={activeTab === 'inventory' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('inventory')}
                        className={activeTab === 'inventory' ? 'shadow-sm' : 'text-slate-600'}
                    >
                        Medicine Inventory
                    </Button>
                    <Button
                        variant={activeTab === 'requests' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('requests')}
                        className={activeTab === 'requests' ? 'shadow-sm' : 'text-slate-600'}
                    >
                        Employee Requests
                    </Button>
                    <Button
                        variant={activeTab === 'records' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('records')}
                        className={activeTab === 'records' ? 'shadow-sm' : 'text-slate-600'}
                    >
                        Employee Records
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'inventory' ? <InventoryTable /> :
                    activeTab === 'requests' ? <RequestsTab /> :
                        <EmployeeRecordsTab />}
            </div>
        </div>
    );
};
