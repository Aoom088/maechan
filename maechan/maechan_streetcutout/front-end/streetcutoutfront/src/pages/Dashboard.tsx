import React from 'react';
import aa from '../assets/aa.png';
import bb from '../assets/bb.jpg';
import cc from '../assets/cc.jpg';

const links = [
  { id: 1, src: aa, url: 'https://example.com/1', alt: 'Advertisement 1' },
  { id: 2, src: bb, url: 'https://example.com/2', alt: 'Advertisement 2' },
  { id: 3, src: cc, url: 'https://example.com/3', alt: 'Advertisement 3' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-300 text-black p-4 flex items-center justify-center">
        <h1 className="text-2xl">"ประชาชนมีส่วนร่วมพัฒนาเมืองแม่จันให้เป็นเมืองน่าอยู่"</h1>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        {/* Block ว่าง ๆ สำหรับดึง API รูปภาพจากฝั่ง Frappe */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold text-gray-700">ภาพจาก Frappe</h2>
          <div className="flex justify-center items-center h-64 bg-gray-200 rounded-lg">
            {/* เพื่อนของคุณสามารถเพิ่มโค้ดสำหรับดึงรูปภาพ API ที่นี่ */}
            <p className="text-gray-500">กำลังโหลดภาพ...</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-xl font-semibold mb-4 text-center">ข่าวสาร</h1>
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
