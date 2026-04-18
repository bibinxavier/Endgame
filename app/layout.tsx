import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/tailwind.css';

const Layout: React.FC = ({ children }) => {
    return (
        <AuthProvider>
            <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
};

export default Layout;