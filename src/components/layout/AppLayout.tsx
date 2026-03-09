import React from 'react';
import { Button } from '../ui/primitives';
import { HeartPulse, Repeat } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
    userRole: 'Admin' | 'Employee';
    onRoleSwitch: () => void;
}

export const AppLayout = ({ children, userRole, onRoleSwitch }: AppLayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="bg-brand-blue border-b border-brand-blue-dark shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-yellow flex items-center justify-center text-brand-blue-dark shadow-sm">
                            <HeartPulse size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                                Baliwag Water District
                            </h1>
                            <p className="text-sm text-brand-yellow-200 font-medium tracking-wide">
                                Medicine Inventory System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs text-brand-blue-200 uppercase tracking-widest font-semibold">
                                Perspective
                            </span>
                            <span className="text-sm font-bold text-white">
                                {userRole}
                            </span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 ml-4 font-semibold"
                            onClick={onRoleSwitch}
                        >
                            <Repeat size={16} />
                            Switch <span className="hidden sm:inline">Role</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-auto shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Baliwag Water District. Frontend Only Prototype.</p>
                </div>
            </footer>
        </div>
    );
};
