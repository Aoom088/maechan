// src/Dashboard.tsx
import React from 'react';
import aa from '../assets/aa.png';
import bb from '../assets/bb.jpg';
import cc from '../assets/cc.jpg';

const notifications = [
  { id: 1, message: 'ระบบได้รับการอัปเดตสำเร็จ' },
  { id: 2, message: 'การสำรองข้อมูลเสร็จสิ้น' },
];

const links = [
  { id: 1, src: aa, url: 'https://example.com/1', alt: 'Advertisement 1' },
  { id: 2, src: bb, url: 'https://example.com/2', alt: 'Advertisement 2' },
  { id: 3, src: cc, url: 'https://example.com/3', alt: 'Advertisement 3' },
  { id: 4, src: cc, url: 'https://example.com/4', alt: 'Advertisement 4' },
  // เพิ่มโฆษณาอื่น ๆ ที่นี่
  { id: 5, src: aa, url: 'https://example.com/5', alt: 'Advertisement 5' },
  { id: 6, src: bb, url: 'https://example.com/6', alt: 'Advertisement 6' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-300 text-black p-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold">"ประชาชนมีส่วนร่วมพัฒนาเมืองแม่จันให้เป็นเมืองน่าอยู่"</h1>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="bg-green-100 text-green-800 p-4 rounded shadow-md mb-4">
          <h2 className="font-semibold text-lg">การแจ้งเตือนล่าสุด</h2>
          <ul className="mt-2 space-y-2">
            {notifications.map(notification => (
              <li key={notification.id} className="text-sm">{notification.message}</li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-4">
              {links.map(link => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={link.id}
                  className="bg-white p-2 rounded-lg border border-gray-100 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={link.src}
                    alt={link.alt}
                    className="w-64 h-64 object-cover rounded-lg transition-opacity duration-300 hover:opacity-80 cursor-pointer"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
