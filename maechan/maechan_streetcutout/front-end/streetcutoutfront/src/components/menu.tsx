import { Button, ButtonProps } from "@nextui-org/react"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { FaBuilding, FaHome } from "react-icons/fa"
import { FaFileLines, FaUserPen } from "react-icons/fa6"
import { TbLicense } from "react-icons/tb"
import { useLocation, useNavigate } from "react-router-dom"

function AppSidebarButton(props: PropsWithChildren<ButtonProps & {exact? : boolean}>) {

    const { size, className, children } = props
    const location = useLocation()
    const navigate = useNavigate()

    let _className = "mb-1 justify-start w-full leading-3" + className
    let _size = size ?? 'md'
    let _startContent = props.startContent ?? null
    let _href = props.href ?? null
    let _exact = props.exact ?? true
    let isActive = _exact ? _href == location.pathname : _href ? location.pathname.startsWith(_href) : false

    // console.log('isactive',isActive)
    let _variant = isActive ? "solid" : props.variant ?? 'light'
    let _color: "primary" | "default" = isActive ? "primary" : "default"

    let _onClick = props.onClick ?? (() => {
        if (_href) {
            navigate(_href)
        }

    })


    return (
        <Button
            color={_color}
            variant={_variant}
            size={_size}
            className={_className}
            onClick={_onClick}
            startContent={_startContent}
        >
            {children}
        </Button>
    );
    
}

export function SidebarMenu() {
		const [profile, setProfile] = useState(null);
		let { call } = useContext(FrappeContext) as FrappeConfig;
		// const navigate = useNavigate()
		
	
		async function checkProfile() {
			const getCheckProfile = await call.get('maechan.maechan.doctype.userprofile.userprofile.check_current_userprofile');
			setProfile(getCheckProfile.message);
		}

		useEffect(() => {
			checkProfile();
			// if (profile === false) {
			// 	navigate('/profile')
			// }
		}, [profile]);
	
    
    return (
        <ul>
            <li>
                <AppSidebarButton href="/" startContent={<FaHome />}>
                    หน้าหลัก</AppSidebarButton>
            </li>
            {profile && (
                <li>
                    <AppSidebarButton exact={false} href="/pageStreetcutout" startContent={<TbLicense />}>
                        ใบอนุญาต
                    </AppSidebarButton>
                </li>
            ) }


            <li>
                <AppSidebarButton href="/profile" startContent={<FaUserPen />}>ข้อมูลส่วนตัว</AppSidebarButton>

            </li>
        </ul>
    )
}