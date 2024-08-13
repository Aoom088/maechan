// Login.tsx
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();

        const userCookie = Cookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            if (userData.email === email && userData.password === password) {
                navigate('/home');
            } else {
                alert('Invalid email or password');
            }
        } else {
            alert('No user data found');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className='flex justify-center items-center'>
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">ยินดีต้อนรับ</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">อีเมลล์</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        เข้าสู่ระบบ
                    </button>
                </form>
                <button
                    type="button"
                    className="w-full mt-4 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    onClick={() => navigate('/register')}
                >
                    สมัครสมาชิก
                </button>
            </div>
        </div>
    );
};

export default Login;
