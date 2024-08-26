import { BreadcrumbItem, Breadcrumbs, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { FrappeConfig, FrappeContext, useSWR } from "frappe-react-sdk"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useMemo, useState } from "react"
import { FaEdit, FaFileDownload, FaFileImage, FaHome, FaPlus, FaReceipt } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { Doctype, IBusiness, IHouse, IRequestLicense, IRequestLicenseInspect } from "../../interfaces"
import { FaFile, FaFileImport, FaMagnifyingGlass } from "react-icons/fa6"
import { useAlertContext } from "../../providers/AlertProvider"
import { DateTime } from "luxon"

function Requeststreetcutouttax() {

    const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin
    const navigate = useNavigate()
    const alert = useAlertContext()
    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.post(url).then((res) => res);


    const { data, error, isLoading } = useSWR(
        "maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_request_StreetcutoutTaxs",
        fetcher
    );
    const [requeststreetcutouttaxs, setRequeststreetcutouttaxs] = useState([] as (IRequestLicense)[])
    const [licenses, setLicenses] = useState({} as any)

    const loadRequeststreetcutouttaxs = async () => {
        setRequeststreetcutouttaxs(data.message)
        setLicenses(data.licenses)

    }

    console.log(requeststreetcutouttaxs)

    useEffect(() => {
        console.log(data)
        if (data) {
            loadRequeststreetcutouttaxs()
        }

    }, [data])

    useEffect(() => {
        if (error) {
            alert.showError(JSON.stringify(error))
        }

    }, [error])

    const topContent = useMemo(() => {

        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/licenseRequest/create")}
                    color="primary" endContent={<FaPlus />}>เพิ่มคำร้องใบอนุญาต</Button>
            </div>
        )
    }, [])

    const getDocStatus = (doc: IRequestLicense) => {
        if (doc.docstatus == 0) {
            if (doc.request_status == 'รอตรวจสถานที่') {
                return (
                    <div>
                        <div>{doc.request_status}</div>
                    </div>
                )
            }
            return doc.request_status
        } else if (doc.docstatus == 1) {
            return `${doc.request_status} (สำเร็จ)`
        } else {
            return `ยกเลิก`
        }

    }

    const getDocComment = (doc: IRequestLicense) => {
        if (doc.docstatus == 0) {
            if (doc.workflow_state == 'เอกสารไม่ครบ') {
                return (
                    <>
                        {doc.comment}
                    </>
                )
            }
        } else if (doc.workflow_state == 'รอชำระเงิน') {
            return (
                <div>ค่าธรรมเนียม {doc.license_fee} บาท</div>
            )
        } else if (doc.workflow_state == 'คำร้องสำเร็จ') {
            if (licenses[doc.name].length > 0) {
                return (
                    <span>ใบอนุญาตเสร็จสิ้น</span>
                )
            }
            return (
                <span>กำลังดำเนินการ</span>
            )
        }
        return null
    }
    return null;

}

return (
    <div className="flex flex-col">
        <Breadcrumbs className="mb-3">
            <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={'/licenseRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-row lg:w-[50%] text-xl mb-3">
            รายการคำร้องขอใบอนุญาต
        </div>

        <div className="flex flex-col">
            <Table isStriped shadow="none"
                topContent={topContent}
                topContentPlacement="outside"
                classNames={{
                    wrapper: 'p-0'
                }}
                aria-label="รายการคำร้องใบอนุญาต"
            >
                <TableHeader>
                    <TableColumn>คำร้อง</TableColumn>
                    <TableColumn>ที่อยู่</TableColumn>
                    <TableColumn>สถานะ</TableColumn>
                    <TableColumn>หมายเหตุ</TableColumn>
                    <TableColumn className="text-center">การกระทำ</TableColumn>
                </TableHeader>
                {isLoading ? (
                    <TableBody emptyContent={"ไม่มีข้อมูล"}>{[]}</TableBody>)
                    : (
                        <TableBody>
                            {
                                requeststreetcutouttaxs.map(x => (
                                    <TableRow key={x.name}>
                                        <TableCell>
                                            <div>
                                                <div className="font-bold">{x.name}</div>
                                            </div>
                                        </TableCell>

                                        <TableCell>{x.house_no.text_display}</TableCell>
                                        <TableCell>{getDocStatus(x)}</TableCell>
                                        <TableCell>{getDocComment(x)}</TableCell>
                                        <TableCell >
                                            <div className="flex flex-row gap-1 justify-center">
                                                {
                                                    x.docstatus == 0 && ["รอชำระเงิน"].indexOf(x.request_status) >= 0 ?
                                                        (
                                                            <Tooltip placement="top" content="อัพโหลดหลักฐานการชำระเงิน" aria-label="อัพโหลดหลักฐานการชำระเงิน" >
                                                                <span
                                                                    onClick={() => { navigate(`/licenseRequest/${x.name}/payment`) }}
                                                                    className="text-lg cursor-pointer active:opacity-50">
                                                                    <FaFileImport />
                                                                </span>
                                                            </Tooltip>
                                                        ) : (null)
                                                }
                                                {
                                                    x.docstatus == 0 && ["เอกสารไม่ครบ", "สร้าง", "ไม่ผ่าน"].indexOf(x.request_status) >= 0 ?
                                                        (
                                                            <Tooltip placement="top" content="แก้ไข" aria-label="แก้ไข" >
                                                                <span
                                                                    onClick={() => { navigate(`/licenseRequest/${x.name}/edit`) }}
                                                                    className="text-lg cursor-pointer active:opacity-50">
                                                                    <FaEdit />
                                                                </span>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip placement="top" content="ดู" aria-label="ดู" >
                                                                <span
                                                                    onClick={() => { navigate(`/licenseRequest/${x.name}/view`) }}
                                                                    className="text-lg cursor-pointer active:opacity-50">
                                                                    <FaMagnifyingGlass />
                                                                </span>
                                                            </Tooltip>
                                                        )
                                                }
                                                {
                                                    x.docstatus == 0 && ['คำร้องสำเร็จ'].indexOf(x.workflow_state) >= 0 && licenses[x.name].length > 0 ?
                                                        (
                                                            <Tooltip placement="top" content="ใบอนุญาต" aria-label="ใบอนุญาติ" >
                                                                <span
                                                                    onClick={() => { navigate(`/pageLicense/${licenses[x.name][0].name}/view`) }}
                                                                    className="text-lg text-violet-600 cursor-pointer active:opacity-50">
                                                                    <FaFileDownload />
                                                                </span>
                                                            </Tooltip>
                                                        ) : (null)
                                                }

                                            </div>

                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>

                    )
                }

            </Table>

        </div>
    </div>

)
}

export default Requeststreetcutouttax