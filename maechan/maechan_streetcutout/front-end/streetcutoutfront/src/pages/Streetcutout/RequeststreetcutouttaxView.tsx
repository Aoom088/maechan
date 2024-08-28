import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem, Skeleton, Tooltip } from "@nextui-org/react"
import { PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FaHome, FaPlus } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IAmphure, IAttachment, IBusiness, IHouse, IProvince, IRequestDetail, IRequestLicense, IRequestLicenseInspect, IRequestLicenseType, IRequestTypeDetail, ITambon, IUserProfile } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { FaDownload, FaMagnifyingGlass, FaTrash, FaUpload } from "react-icons/fa6"


export default function RequeststreetcutouttaxView() {

    const navigate = useNavigate()
    const alert = useAlertContext()
    const params = useParams()


    let [createForm, setCreateForm] = useState({} as IRequestLicense)

    let [provinces, setProvinces] = useState([] as IProvince[])
    let [amphures, setAmphures] = useState([] as IAmphure[])
    let [districts, setDistricts] = useState([] as ITambon[])
    const [amphureLoad, setAmphureLoad] = useState(false)
    const [districtLoad, setDistrictLoad] = useState(false)
    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)

    const loadProvinceAmphureDistrict = async (requestLicense: IRequestLicense) => {
        let pcall = call.post("maechan.maechan_core.doctype.province.province.get_all_province").then((r: { message: any; }) => {
            let provincesResult = r.message
            setProvinces(provincesResult)
        })

        let acall = null;
        let tcall = null;

        if (requestLicense.applicant_province) {
            acall = call.post("maechan.maechan_core.doctype.province.province.get_all_amphure", {
                filters: {
                    province_id: requestLicense.applicant_province
                }
            }).then((r: any) => {
                let result = r.message
                setAmphures(result)
            })
        }

        if (requestLicense.applicant_amphur) {
            tcall = call.post("maechan.maechan_core.doctype.province.province.get_all_tambon", {
                filters: {
                    province_id: requestLicense.applicant_province,
                    amphure_id: requestLicense.applicant_amphur
                }
            }).then((r: any) => {
                let result = r.message
                setDistricts(result)
            })
        }

        await Promise.all([pcall, acall, tcall])

    }

    const reloadProvinceAmphurDistrict = async (user_profile: IRequestLicense, key = '') => {


        if (user_profile.applicant_province && key == "applicant_province") {
            setAmphureLoad(true)
            call.post("maechan.maechan_core.doctype.province.province.get_all_amphure", {
                filters: {
                    province_id: user_profile.applicant_province
                }
            }).then((r: { message: any; }) => {
                let result = r.message
                setAmphures(result)
            }).finally(() => {
                setAmphureLoad(false)
            })

        }

        if (user_profile.applicant_amphur && key == "applicant_amphur") {
            setDistrictLoad(true)
            call.post("maechan.maechan_core.doctype.province.province.get_all_tambon", {
                filters: {
                    province_id: user_profile.applicant_province,
                    amphure_id: user_profile.applicant_amphur
                }
            }).then((r: any) => {
                let result = r.message
                setDistricts(result)
            }).finally(() => {
                setDistrictLoad(false)
            })
        }
    }



    const updateForm = async (key: string, value: string | number) => {

        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestLicense

        if (key == "applicant_province") {
            createFormValue.applicant_amphur = ""
            createFormValue.applicant_distict = ""
        }
        else if (key == "applicant_amphur") {
            createFormValue.applicant_distict = ""
        }
        reloadProvinceAmphurDistrict(createFormValue, key)
        setCreateForm(createFormValue)
    }

    const loadRequestStreetcutoutTax = async () => {
        let response = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_request_streetcutouttax", {
            name: params.id
        })
        
        let requeststreetcutouttax: IRequestLicense = response.message

        setCreateForm(requeststreetcutouttax)
        await loadProvinceAmphureDistrict(requeststreetcutouttax)

        return requeststreetcutouttax

    }



    useEffect(() => {
        setIsLoading(true)
        loadRequestStreetcutoutTax().then((requeststreetcutouttax: IRequestLicense) => {
        })
    }, [])


    const [isSaving, setIsSaving] = useState(false)

    const save = async () => {
        setIsSaving(true)
        let response = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.first_step_requeststreetcutouttax", {
            request: createForm
        })

        console.log(response)
        setCreateForm(response.message)
        setIsSaving(false)
    }

    const siteName = import.meta.env.VITE_FRAPPE_URL



    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>คำร้องขอใบอนุญาต : {params.id}
                </BreadcrumbItem>
            </Breadcrumbs>


            <div className="flex flex-row text-xl mb-3 justify-between">
                <div>คำร้องขอใบอนุญาต : {params.id}</div>
                <div>
                    {/* {workFlowActionButton()} */}
                </div>
            </div>

            <Tabs aria-label="Tabs" isDisabled={isLoading}>
                <Tab key="basic_information" aria-label="ข้อมูลพื้นฐาน" title="ข้อมูลพื้นฐาน" className="flex flex-col">
                    <Skeleton isLoaded={!isLoading}>
                        <div className="flex flex-col mb-3 gap-3 sm:flex-row">
                            <div className="flex flex-row lg:w-[50%] w-full">
                            test
                            </div>
                        </div>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ลักษณะการดำเนินการ
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            test
                        </div>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ข้อมูลผู้ขอใบอนุญาต
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            test

                        </div>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ที่อยู่ผู้ขอใบอนุญาต
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                            test
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                            test
                        </div>

                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ที่อยู่สถานประกอบการ (หากไม่พบบ้านเลขที่กรุณาแจ้งผู้ดูแลระบบ)
                        </div>
                        <div className="grid gap-3 mb-3 grid-row sm:grid-cols-3">
                            test
                        </div>

                        <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                            <Button className="mr-3" onClick={() => { navigate("/licenseRequest") }} color="default">ยกเลิก</Button>
                        </div>
                    </Skeleton>
                </Tab>
            </Tabs>
        </div >

    )
}