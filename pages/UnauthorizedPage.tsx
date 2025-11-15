
import React from 'react';
import { NavLink } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
            <div>
                <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">403</h1>
                <h2 className="text-2xl md:text-4xl font-bold mt-4 text-white">Access Denied</h2>
                <p className="mt-4 text-dark-text">Sorry, you do not have permission to access this page.</p>
                <NavLink to="/" className="mt-8 inline-block bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-full transition-colors">
                    Go Back Home
                </NavLink>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
