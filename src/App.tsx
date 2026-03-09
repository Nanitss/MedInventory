import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';

function App() {
  const [role, setRole] = useState<'Admin' | 'Employee'>('Admin');

  return (
    <AppLayout
      userRole={role}
      onRoleSwitch={() => setRole(role === 'Admin' ? 'Employee' : 'Admin')}
    >
      {role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </AppLayout>
  );
}

export default App;
