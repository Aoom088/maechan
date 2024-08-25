import { BreadcrumbItem, Breadcrumbs, Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaEdit, FaFileDownload, FaFileImport, FaHome, FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass, FaMagnifyingGlassArrowRight, FaRotate } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAlertContext } from "../../providers/AlertProvider";
import { FrappeContext, FrappeConfig, useSWR } from "frappe-react-sdk";

export default function StreetcutoutIndex() {

    const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin
    const navigate = useNavigate()
    const alert = useAlertContext()
    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.post(url).then((res) => res);

    const { data, error, isLoading, mutate } = useSWR(
        "maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_requeststreetcutouttax",
        fetcher
    );

    
    const topContent = useMemo(() => {
        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/licenseRequest/create")} //เเก้
                    color="primary" endContent={<FaPlus />}>เพิ่มคำร้องใบอนุญาต</Button>
            </div>
        )
    }, [])

    const RenewStreetcutout = ({ doc }: { doc: any }) => {

        const [renewLoading, setRenewLoading] = useState(false)
        const [isRenew, setIsRenew] = useState(false)

        const { call } = useContext(FrappeContext) as FrappeConfig

        {/*
        useEffect(() => {
            setIsRenew(!!doc.renew_request)
        }, doc)

        const createRenew = () => {
            setRenewLoading(true)
            call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.renew_license", { //เเก้
                license: doc.name
            }).then(r => {
                mutate().then(r2 => {
                    setRenewLoading(false)
                })

            })

        }

        if (isRenew) {
            if (doc.renew_workflow_state == "สร้าง") {
                return (
                    <Tooltip placement="top" content="แก้ไขใบคำร้องขอต่อใบอนุญาต" aria-label="แก้ไขใบคำร้องขอต่อใบอนุญาต" >
                        <span
                            onClick={() => { navigate(`/licenseRequest/${doc.renew_request}/edit`) }} //เเก้
                            className="text-lg  cursor-pointer active:opacity-50">
                            <FaMagnifyingGlassArrowRight />
                        </span>
                    </Tooltip>
                )
            } else {
                return (
                    <Tooltip placement="top" content="ดูใบคำร้องขอต่อใบอนุญาต" aria-label="ดูใบคำร้องขอต่อใบอนุญาต" >
                        <span
                            onClick={() => { navigate(`/licenseRequest/${doc.renew_request}/view`) }} //เเก้
                            className="text-lg  cursor-pointer active:opacity-50">
                            <FaMagnifyingGlass />
                        </span>
                    </Tooltip>
                )
            }

        }

        if (renewLoading) {

            return (
                <Spinner size="sm" />
            )

        } else {

            return (
                <Tooltip placement="top" content="สร้างคำร้องต่อใบอนุญาต" aria-label="สร้างคำร้องต่อใบอนุญาต" >
                    <span
                        onClick={() => { createRenew() }}
                        className="text-lg text-green-500 cursor-pointer active:opacity-50">
                        <FaRotate />
                    </span>
                </Tooltip>
            )
        }
        */}



    }

    return (<div className="flex flex-col">
        <Breadcrumbs className="mb-3">
            <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={'/pageStreetcutout'}>ใบอนุญาต</Link></BreadcrumbItem>
        </Breadcrumbs>

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
                    <TableColumn className="w-4/12">เลขที่คำร้อง</TableColumn> 
                    <TableColumn>สถาณะ</TableColumn>
                    <TableColumn>จำนวน</TableColumn>
                    <TableColumn>ราคา</TableColumn>
                    <TableColumn className="text-center">การกระทำ</TableColumn>
                </TableHeader>
                
                {isLoading ? (
                    <TableBody emptyContent={"ไม่มีข้อมูล"}>{[]}</TableBody>)
                    : (
                        <TableBody>
                            {
                                data.message.map((x: any) => (
                                    <TableRow key={x.name}>
                                        <TableCell>
                                            <div>
                                                <div className="font-bold">{x.license_applicant_title ?? x.license_applicant}</div>
                                                <div>{x.licensetype_title}</div>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>{x.approve_status_requeststreetcutouttax}</TableCell>
                                        <TableCell>{x.streetcutout_count_requeststreetcutouttax}</TableCell>
                                        <TableCell>{x.cost_requeststreetcutouttax}</TableCell>

                                        {/*
                                        <TableCell>
                                            
                                            <div className="flex flex-row gap-1 justify-center">
                                                <Tooltip placement="top" content="ใบอนุญาต" aria-label="ใบอนุญาติ" >
                                                    <span
                                                        onClick={() => { navigate(`/pageLicense/${x.name}/view`) }}
                                                        className="text-lg text-violet-600 cursor-pointer active:opacity-50">
                                                        <FaFileDownload />
                                                    </span>
                                                </Tooltip>

                                                {
                                                    x.workflow_state == 'Expired' || x.workflow_state == 'Approved' ? (
                                                        <RenewLicense doc={x} />
                                                    ) : (null)
                                                }
                                            </div>
                                            
                                        </TableCell>
                                        */}

                                    </TableRow>
                                ))
                            }

                        </TableBody>

                    )
                }

            </Table>

        </div>

    </div>)
}