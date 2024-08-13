import React from 'react';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // ลบคุกกี้ loggedIn แต่ไม่ลบข้อมูลผู้ใช้
        Cookies.remove('loggedIn');

        navigate('/'); // กลับไปยังหน้า login
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-700">Welcome to Home Page</h1>
                <button
                    onClick={handleLogout}
                    className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;
