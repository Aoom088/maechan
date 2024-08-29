import { FrappeConfig, FrappeContext } from 'frappe-react-sdk';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

function Dashboard() {
    const [completed, setCompleted] = useState({
        profile: false,
        business: false,
        request: false,
        permit: false,
    });

    const { call } = useContext(FrappeContext) as FrappeConfig;

    const fetcher = (url: string) => call.get(url).then(response => response.message);

    const { data: profile, error: profileError } = useSWR(
        'maechan.maechan.doctype.userprofile.userprofile.check_current_userprofile',
        fetcher
    );

    const { data: business, error: businessError } = useSWR(
        'maechan.maechan_license.doctype.business.business.check_businesses',
        fetcher
    );

    const { data: request, error: requestsError } = useSWR(
        'maechan.maechan_license.doctype.requestlicense.requestlicense.check_requst_license',
        fetcher
    );
    
    const { data: permit, error: permitsError } = useSWR(
        'maechan.maechan_license.doctype.license.license.check_license',
        fetcher
    );

    console.log("request : ", request);
    console.log("permit : ", permit);

    // Use useEffect to update the state after data fetching
    useEffect(() => {
        const updateCompleted = async () => {
            // Wait for all data to be loaded
            await Promise.all([profile, business, request, permit]);

            // Only update the state if all data is available
            if (profile !== undefined && business !== undefined && request !== undefined && permit !== undefined) {
                setCompleted(prevState => ({
                    ...prevState,
                    profile,
                    business,
                    request,
                    permit,
                }));
            }
        };

        updateCompleted();
    }, [profile, business, request, permit]);

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );

    const CrossIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    const renderIcon = (state) => {
        if (state === true) return <CheckIcon />;
        if (state === false) return <CrossIcon />;
        return <div className="w-6 h-6 border-2 border-gray-500"></div>;
    };

    return (
        <div className="flex flex-col gap-3 items-center">
            <header className="text-xl font-bold container text-center bg-gray-400 rounded-md">"ประชาชนมีส่วนร่วมพัฒนาเมืองแม่จันให้เป็นเมืองที่น่าอยู่"</header>
            <h1 className="font-bold">การใช้งานเบื้องต้น</h1>
        </div>
    );
}

export default Dashboard;
