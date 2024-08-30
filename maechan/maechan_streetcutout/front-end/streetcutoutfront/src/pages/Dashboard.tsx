import useSWR from 'swr';
import { FrappeContext, FrappeConfig } from "frappe-react-sdk";
import { useContext, useEffect, useState } from 'react';
import { DashboardData } from "../interfaces";

function Dashboard() {
  const [IMG, setIMG] = useState<DashboardData[]>([]);

  const { call } = useContext(FrappeContext) as FrappeConfig;
  const fetcher = (url: string) => call.get(url).then((res) => res.message.data); // เข้าถึง data array

  const { data: img, error: imgError, isLoading: imgloading } = useSWR(
    "maechan.maechan_streetcutout.doctype.dashboardimg.dashboardimg.load_dashboard_imgs",
    fetcher
  );
  console.log(img)
  useEffect(() => {
    if (img) {
      setIMG(img);
      console.log("Fetched images:", img);
    }
  }, [img]);

  useEffect(() => {
    console.log("IMG state:", IMG);
  }, [IMG]);

  return (
    <div className='flex flex-col flex-auto mb-5'>
      <ul>
        <h1 className='p-5 text-xl font-bold tracking-widest text-white bg-custom-gradient rounded mb-5'>
          ติดต่อสอบถามภาษีป้าย
        </h1>
        <li className='flex flex-col flex-wrap mb-8'>
          <h1 className='text-xl font-sans tracking-wide text-black text-center mb-3'>
            เทศบาลแม่จัน
          </h1>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            555 หมู่ 4 ถนนพหลโยธิน ตำบลแม่จัน อำเภอแม่จัน จังหวัดเชียงราย
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            โทร. 0-5377-1222 โทรสาร 0-5377-2565
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            Email : maechan.md@gmail.com
          </h2>
          <h2 className='text-base font-sans tracking-wide text-black text-center'>
            Email : saraban@maechan.go.th
          </h2>
        </li>
      </ul>

      <div className='container  px-4 mb-4 border-gray-200  text-xl text-center'>
        การเก็บภาษีป้าย
        <div className='flex flex-auto justify-center'>
          {imgloading ? (
            <p>กำลังโหลด.....</p>
          ) : (
            IMG.map((imgData: DashboardData) => (
              <img
                src={'http://maechandev.chaowdev.xyz:8001/' + imgData.dashboard_img}
                alt=""
                className="max-h-unit-7xl "
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
