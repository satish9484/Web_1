import React from 'react';
import { useNavigate } from 'react-router-dom';

const TokenExpired = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/login'); // Adjust the route as per your login path
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-800 text-white">
            <div className="max-w-md text-center">
                <div className="text-7xl font-bold mb-4">403</div>
                <h1 className="text-2xl font-semibold mb-2">Token Expired</h1>
                <p className="mb-6">
                    Sorry, the token you're using for doesn't exist anymore. You can go back to the login screen.
                </p>
                <button
                    onClick={handleGoBack}
                    className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 border border-white transition-all text-white font-semibold"
                >
                    Go Back to Login
                </button>
            </div>
        </div>
    );
};

export default TokenExpired;
