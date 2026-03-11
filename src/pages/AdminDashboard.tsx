import { useState } from 'react';
import { InventoryTable } from '../components/admin/InventoryTable.tsx';
import { RequestsTab } from '../components/admin/RequestsTab.tsx';
import { EmployeeRecordsTab } from '../components/admin/EmployeeRecordsTab.tsx';
import { EmployeeListTab } from '../components/admin/EmployeeListTab.tsx';
import { OverviewTab } from '../components/admin/OverviewTab.tsx';
import { DisposedMedicinesTab } from '../components/admin/DisposedMedicinesTab.tsx';
import { Button } from '../components/ui/primitives';
import { ChevronDown } from 'lucide-react';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'requests' | 'records' | 'employees' | 'disposed'>('overview');
    const [showInventoryMenu, setShowInventoryMenu] = useState(false);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h2>
                    <p className="text-sm text-slate-500">Manage medicine inventory and employee requests</p>
                </div>
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
                    <Button
                        variant={activeTab === 'overview' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('overview')}
                        className={`whitespace-nowrap text-xs sm:text-sm ${activeTab === 'overview' ? 'shadow-sm' : 'text-slate-600'}`}
                    >
                        Overview
                    </Button>
                    <div className="relative">
                        <Button
                            variant={activeTab === 'inventory' || activeTab === 'disposed' ? 'primary' : 'ghost'}
                            onClick={() => setShowInventoryMenu(!showInventoryMenu)}
                            className={`whitespace-nowrap text-xs sm:text-sm flex items-center gap-1 ${activeTab === 'inventory' || activeTab === 'disposed' ? 'shadow-sm' : 'text-slate-600'}`}
                        >
                            Medicine Inventory <ChevronDown size={14} className={`transition-transform ${showInventoryMenu ? 'rotate-180' : ''}`} />
                        </Button>
                        {showInventoryMenu && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 shadow-lg rounded-md overflow-hidden z-50">
                                <button
                                    onClick={() => { setActiveTab('inventory'); setShowInventoryMenu(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${activeTab === 'inventory' ? 'bg-brand-blue-50 text-brand-blue font-medium' : 'text-slate-700'}`}
                                >
                                    Active Inventory
                                </button>
                                <button
                                    onClick={() => { setActiveTab('disposed'); setShowInventoryMenu(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${activeTab === 'disposed' ? 'bg-brand-blue-50 text-brand-blue font-medium' : 'text-slate-700'}`}
                                >
                                    Disposed Medicines
                                </button>
                            </div>
                        )}
                    </div>
                    <Button
                        variant={activeTab === 'requests' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('requests')}
                        className={`whitespace-nowrap text-xs sm:text-sm ${activeTab === 'requests' ? 'shadow-sm' : 'text-slate-600'}`}
                    >
                        Employee Medicine
                    </Button>
                    <Button
                        variant={activeTab === 'records' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('records')}
                        className={`whitespace-nowrap text-xs sm:text-sm ${activeTab === 'records' ? 'shadow-sm' : 'text-slate-600'}`}
                    >
                        Consultation Records
                    </Button>
                    <Button
                        variant={activeTab === 'employees' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('employees')}
                        className={`whitespace-nowrap text-xs sm:text-sm ${activeTab === 'employees' ? 'shadow-sm' : 'text-slate-600'}`}
                    >
                        Employees
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'overview' ? <OverviewTab /> :
                    activeTab === 'inventory' ? <InventoryTable /> :
                        activeTab === 'requests' ? <RequestsTab /> :
                            activeTab === 'records' ? <EmployeeRecordsTab /> :
                                activeTab === 'employees' ? <EmployeeListTab /> :
                                    <DisposedMedicinesTab />}
            </div>
        </div>
    );
};
