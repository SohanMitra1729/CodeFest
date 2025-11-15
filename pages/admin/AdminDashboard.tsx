import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex h-screen bg-pro-gradient overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
