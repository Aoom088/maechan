import React from 'react';
import { Card, Divider , CardBody} from "@nextui-org/react";

interface LicenseInfo {
  businessName: string;
  licenseType: string;
  licenseSubtype: string;
  ownerName: string;
  ownerStatus: string;
  nationality: string;
  ethnicity: string;
  address: {
    number: string;
    moo: string;
    soi: string;
    road: string;
    subdistrict: string;
    district: string;
    province: string;
  };
  contact: {
    phone: string;
    fax: string;
  };
  businessAddress: string;
  businessPhone: string;
}

const license = {
    businessName: "ป.รุ่งเรืองการยาง",
    licenseType: "ประกอบกิจการทีเป็นอันตรายต่อสุขภาพ",
    licenseSubtype: "ประกอบกิจการทีเป็นอันตรายต่อสุขภาพ-การปะ การเชื่อมยาง 7(63)",
    ownerName: "นาย อนุกูล ดอนหลิมไพร",
    ownerStatus: "บุคคลธรรมดา",
    nationality: "ไทย",
    ethnicity: "ไทย",
    address: {
      number: "158",
      moo: "2",
      soi: "-",
      road: "หิรัญนคร",
      subdistrict: "แม่จัน",
      district: "แม่จัน",
      province: "เชียงราย"
    },
    contact: {
      phone: "097-9242289",
      fax: "-"
    },
    businessAddress: "158158 หมู่ 2 แม่จัน แม่จัน เชียงราย",
    businessPhone: "097-9242289"
  };

const LicenseDetail: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardBody>
          <h3 className="text-2xl mb-2">ใบอนุญาตสำหรับสถานประกอบกิจการ <span className="font-bold">{license.businessName}</span></h3>
          <p className="mb-4">ชื่อใบอนุญาต <strong>{license.licenseType}</strong></p>
          
          {/* <Divider className="my-4" /> */}
          
          <h4 className="text-xl font-bold mb-2">ข้อมูลเบื้องต้น</h4>
          <p>ประเภทใบอนุญาต <strong>{license.licenseSubtype}</strong></p>
          <p className="mb-4">ชนิดใบอนุญาต <strong>{license.licenseType}</strong></p>
          
          {/* <Divider className="my-4" /> */}
          
          <h4 className="text-xl font-bold mb-2">ข้อมูลผู้ขอใบอนุญาต</h4>
          <p>สถานะ <strong>{license.ownerStatus}</strong></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 mb-4">
            <p>ผู้ได้รับใบอนุญาต(ผู้ขอใบอนุญาต) <strong>{license.ownerName}</strong></p>
            <p>ชื่อสถานประกอบการ <strong>{license.businessName}</strong></p>
            <p>สัญชาติ <strong>{license.nationality}</strong></p>
            <p>เชื้อชาติ <strong>{license.ethnicity}</strong></p>
          </div>
          
          {/* <Divider className="my-4" /> */}
          
          <h4 className="text-xl font-bold mb-2">ที่อยู่ผู้ได้รับใบอนุญาต(ผู้ขอใบอนุญาต)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <p>เลขที่ <strong>{license.address.number}</strong></p>
            <p>หมู่ <strong>{license.address.moo}</strong></p>
            <p>ซอย <strong>{license.address.soi || '-'}</strong></p>
            <p>ถนน <strong>{license.address.road}</strong></p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <p>ตำบล <strong>{license.address.subdistrict}</strong></p>
            <p>อำเภอ <strong>{license.address.district}</strong></p>
            <p>จังหวัด <strong>{license.address.province}</strong></p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
            <p>โทรศัพท์ <strong>{license.contact.phone}</strong></p>
            <p>แฟกซ์ <strong>{license.contact.fax || '-'}</strong></p>
          </div>
          
          {/* <Divider className="my-4" /> */}
          
          <h4 className="text-xl font-bold mb-2">ที่อยู่สถานประกอบการ</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>ที่ตั้งสถานประกอบการ <strong>{license.businessAddress}</strong></p>
            <p>โทรศัพท์ <strong>{license.businessPhone}</strong></p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default LicenseDetail;