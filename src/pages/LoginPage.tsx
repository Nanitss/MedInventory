import { useState } from 'react';
import { HeartPulse, LogIn, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import LiquidEther from '../components/ui/LiquidEther';

interface LoginPageProps {
    onLogin: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'p@ssw0rd4522';

export const LoginPage = ({ onLogin }: LoginPageProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            triggerShake();
            return;
        }

        setIsLoading(true);

        // Simulate a brief auth delay for UX
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                onLogin();
            } else {
                setError('Invalid username or password.');
                triggerShake();
                setIsLoading(false);
            }
        }, 600);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-blue-dark relative overflow-hidden">
            {/* Background Liquid Ether Animation */}
            <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#1100fa', '#00ccff', '#acebfb']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={true}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>
            
            {/* Subtle dark overlay for contrast */}
            <div className="absolute inset-0 bg-brand-blue-dark/20 z-0 pointer-events-none mix-blend-multiply" />

            {/* Header */}
            <header className="relative z-10 pt-8 pb-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-blue-dark shadow-lg shadow-brand-yellow/20">
                        <HeartPulse size={28} strokeWidth={2.5} />
                    </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Baliwag Water District
                </h1>
                <p className="text-brand-yellow-200 text-sm font-medium mt-1 tracking-wide">
                    Medicine Inventory System
                </p>
            </header>

            {/* Main Login Card */}
            <main className="relative z-10 flex-1 flex items-start sm:items-center justify-center px-4 pb-12 pt-4 sm:pt-0">
                <div
                    className={`w-full max-w-md transition-transform duration-100 ${shake ? 'animate-shake' : ''}`}
                >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-light px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                                    <ShieldAlert size={22} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Admin Login</h2>
                                    <p className="text-brand-blue-200 text-sm">Sign in to access the dashboard</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
                                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div className="space-y-2">
                                <label htmlFor="login-username" className="block text-sm font-semibold text-slate-700">
                                    Username
                                </label>
                                <input
                                    id="login-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-200 text-sm"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-200 text-sm"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                id="login-submit"
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-light text-white font-semibold py-3.5 px-6 rounded-xl hover:from-brand-blue-dark hover:to-brand-blue transition-all duration-300 shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-white/40 text-xs mt-6">
                        Authorized personnel only. Contact IT for access issues.
                    </p>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="relative z-10 py-4 text-center">
                <p className="text-white/30 text-xs">
                    &copy; {new Date().getFullYear()} Baliwag Water District. All rights reserved.
                </p>
            </footer>
        </div>
    );
};
