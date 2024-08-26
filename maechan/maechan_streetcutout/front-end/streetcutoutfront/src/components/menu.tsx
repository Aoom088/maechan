import { FaHome } from "react-icons/fa";
import { FaFileLines, FaUserPen } from "react-icons/fa6";
import { TbLicense } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { FrappeContext, FrappeConfig } from "frappe-react-sdk";
import { AppSidebarButton } from "./AppSidebarButton"; // Import your button component

export function SidebarMenu() {
    const [profile, setProfile] = useState<any>(null);
    const { call } = useContext(FrappeContext) as FrappeConfig;

    // Fetch profile information
    async function checkProfile() {
        try {
            const getCheckProfile = await call.get('maechan.maechan.doctype.userprofile.userprofile.check_current_userprofile');
            setProfile(getCheckProfile.message);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    }

    useEffect(() => {
        checkProfile();
    }, []);

    return (
        <ul className="list-none p-0 m-0">
            <li>
                <AppSidebarButton href="/" startContent={<FaHome />}>
                    หน้าหลัก
                </AppSidebarButton>
            </li>
            {profile && (
                <>
                    <li>
                        <AppSidebarButton exact={false} href="/StreetcutoutRequest" startContent={<FaFileLines />}>
                            คำร้องขอใบอนุญาต
                        </AppSidebarButton>
                    </li>
                    <li>
                        <AppSidebarButton exact={false} href="/pageStreetcutout" startContent={<TbLicense />}>
                            ใบอนุญาต
                        </AppSidebarButton>
                    </li>
                </>
            )}
            <li>
                <AppSidebarButton href="/profile" startContent={<FaUserPen />}>
                    ข้อมูลส่วนตัว
                </AppSidebarButton>
            </li>
        </ul>
    );
}
