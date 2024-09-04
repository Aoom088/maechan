import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { FaHome, FaPlus } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { IRequestStreetcutout, IAmphure, IBusiness, IHouse, IProvince, IRequestDetail, IRequestLicense, IRequestLicenseType, ITambon, IUserProfile } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"

export default function RequeststreetcutouttaxCreate() {

    const navigate = useNavigate()
    const alert = useAlertContext()


    const topContent = useMemo(() => {

        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/StreetcutoutRequest/create")}
                    color="primary" endContent={<FaPlus />}>เพิ่มคำร้องใบอนุญาต</Button>
            </div>
        )
    }, [])


    let [createForm, setCreateForm] = useState({} as IRequestStreetcutout)
    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)
    const [invalid, setInvalid] = useState(true)

    console.log(invalid)


    const updateForm = async (key: string, value: string | number) => {

        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestStreetcutout

    }


    useEffect(() => {

    }, [])

    const [error, setError] = useState({
        result: null,
    })

    const save = async () => {
        let response = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.first_step_requeststreetcutouttax", {
            request: createForm
        })
        console.log(response)


        navigate(`/StreetcutoutRequest/${response.message.name}/edit`)

    }

    const validate = () => {

        if (createForm.streetcutout_img) {
            return true
        }

        alert.showError("กรุณาอัพโหลดตัวอย่างป้าย")

        return false
    }
    const UploadButton = ({ doc }: { doc: IRequestStreetcutout }) => {

        const { file } = useContext(FrappeContext) as FrappeConfig

        const inputFile = useRef<HTMLInputElement>(null)

        const [isUploading, setIsUploading] = useState(false)
        const openInputFile = () => {
            inputFile?.current?.click();

        }

        const uploadFile = async (e: any) => {
            setIsUploading(true)
            let myFile = e.target.files[0]
            const fileArgs = {
                "isPrivate": false,
                "folder": "home/RequestStreetcutoutAttachment",
            }

            file.uploadFile(
                myFile,
                fileArgs,
                /** Progress Indicator callback function **/
                (completedBytes, totalBytes) => console.log(Math.round((completedBytes / (totalBytes ?? completedBytes + 1)) * 100), " completed")
            )
                .then((response) => {
                    console.log("File Upload complete")
                    let fileResponse = response.data.message
                    console.log(response)
                    call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.first_step_requeststreetcutouttax", {
                    }).catch(e => alert.showError(JSON.stringify(e)))
                })
                .catch(e => console.error(e))


        }
        const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin


        if (doc.streetcutout_img) {
            return (
                <div className="flex flex-row gap-3">
                    <Button isLoading={isUploading} onClick={() => { window.open(`${siteName}/${doc.streetcutout_img}`) }} color="primary">
                        ดูรูป
                    </Button>
                    <Button isLoading={isUploading}  color="danger">ลบ</Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button isLoading={isUploading} color="primary" onClick={openInputFile}>อัพโหลดตัวอย่างป้าย</Button>
                    <input type="file" id="file" onChange={uploadFile} ref={inputFile} style={{ display: "none" }} />

                </div>
            )
        }


    }
    

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>เพิ่มคำร้องขอใบอนุญาต
                </BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                เพิ่มคำร้องขอใบอนุญาต
            </div>
            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ข้อมูลเจ้าของป้าย
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
                <Input
                    value={createForm.user_name_requeststreetcutouttax}
                    name="user_name_requeststreetcutouttax"
                    onChange={(e) => updateForm(e.target.name, e.target.value)}
                    type="text" label="ชื่อเจ้าของป้าย" />
            </div>
            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ข้อมูลป้าย
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <Input
                    value={createForm.streetcutout_count_requeststreetcutouttax}
                    name="streetcutout_count_requeststreetcutouttax"
                    onChange={(e) => updateForm(e.target.name, Number(e.target.value))}
                    type="number"
                    min="0"
                    label="จำนวนป้าย" />

                <Select
                    label="ขนาดของป้าย"
                    className="" defaultSelectedKeys={["120x240เซนติเมตร"]}
                    onSelectionChange={(k) => updateForm('streetcutout_size', Array.from(k)[0])}
                >
                    <SelectItem key="ขนาดของป้าย" >120x240เซนติเมตร</SelectItem>
                </Select>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
                <UploadButton doc={createForm} />
            </div>

            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                testที่อยู่สถานประกอบการ (หากไม่พบบ้านเลขที่กรุณาแจ้งผู้ดูแลระบบ)
            </div>
            <div className="grid gap-3 mb-3 grid-row sm:grid-cols-3">
                test
            </div>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                <Button disabled={invalid} className={`mr-3`} color="primary" isDisabled={invalid} onClick={save}>บันทึกและต่อไป</Button>
                <Button className="mr-3" onClick={() => { navigate("/StreetcutoutRequest") }} color="default">ยกเลิก</Button>
            </div>
        </div>

    )
}