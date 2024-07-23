import React,{useContext, useEffect, useState} from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link } from "@nextui-org/react";
import { FrappeContext, FrappeConfig } from "frappe-react-sdk"
import { useParams } from 'react-router-dom';



const Business: React.FC = () => {
  const [data, setData] = useState<any>({ message: [] }); 
  const { call } = useContext(FrappeContext) as FrappeConfig;

  let { license_applicant_title } = useParams<{ license_applicant_title: string }>();

  async function loadData() {
    if (license_applicant_title) {
      const response = await call.get(`maechan.api.get_licenseBusiness?license_applicant_title=${license_applicant_title}`);
      setData(response || { message: [] }); 
    }
  }

  useEffect(() => {
    loadData();
  }, [license_applicant_title]);

  // console.log(data.message)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center mb-6">
        ชื่อสถานประกอบการ <span className="font-bold">{data?.message[0]?.name}</span>
      </h1>
      <h2 className="text-xl mb-8">
        ใบอนุญาตสำหรับสถานประกอบกิจการ <span className="font-bold">{data?.message[0]?.name}</span>
      </h2>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <Table aria-label="ตารางรายการใบอนุญาต" className="w-full">
          <TableHeader>
            <TableColumn className="bg-cyan-400 text-gray-800 font-semibold">ชื่อใบอนุญาต</TableColumn>
            <TableColumn className="bg-cyan-400 text-gray-800 font-semibold">วันหมดอายุ</TableColumn>
            <TableColumn className="bg-cyan-400 text-gray-800 font-semibold">ประเภทใบอนุญาต</TableColumn>
            <TableColumn className="bg-cyan-400 text-gray-800 font-semibold">ที่อยู่</TableColumn>
            <TableColumn className="bg-cyan-400 text-gray-800 font-semibold">พิกัด</TableColumn>
          </TableHeader>
          <TableBody>
            {data.message.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell>
                  <Link className='cursor-pointer' href='#'>{item.license_type}</Link>
                </TableCell>
                <TableCell>{new Date(item.license_end_date).toLocaleDateString('en-TH', {year: 'numeric',month: '2-digit',day: '2-digit'}).replace(/-/g, '/')}</TableCell>
                <TableCell>{item.license_main_type}</TableCell>
                <TableCell>
                  {`จังหวัด${item.license_applicant_address_province_th}, อำเภอ${item.license_applicant_address_amphur_th}, ตำบล${item.license_applicant_address_district_th}, หมู่${item.license_applicant_address_moo}`}
                </TableCell>
                <TableCell>
                  <a 
                    // href={`https://www.google.com/maps?q=${item.license_applicant_address_coordinates.lat},${item.license_applicant_address_coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    ดูแผนที่
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Business;
