import { FrappeProvider, useFrappeAuth, FrappeConfig, FrappeContext } from 'frappe-react-sdk'
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import React, { useEffect,useContext, useState } from 'react';
import LicenseDashboard from './pages/License/LicenseDashboard';
import MainPage from './pages/MainPage';
import BusinessIndex from './pages/Business/BusinessIndex';
import BusinessCreate from './pages/Business/BusinessCreate';
import AlertProvider from './providers/AlertProvider';
import Dashboard from './pages/Dashboard';
import RequestLicense from './pages/License/RequestLicense';
import ProfilePage from './pages/Personal/ProfilePage';
import BusinessEdit from './pages/Business/BusinessEdit';
import RequestLicenseCreate from './pages/License/RequestLicenseCreate';
import RequestLicenseEdit from './pages/License/RequestLicenseEdit';
import RequestLicenseView from './pages/License/RequestLicenseView';
import RequestLicensePayment from './pages/License/RequestLicensePayment';
import LicenseIndex from './pages/License/LicenseIndex';
import LicenseView from './pages/License/LicenseView';
import RequestInspectView from './pages/License/RequestInspectView';

function App() {

	const CheckThedsabanUser = ({ children }: React.PropsWithChildren) => {
		const [isThedsabanUser, setIsThedsabanUser] = useState(null);
		let { call } = useContext(FrappeContext) as FrappeConfig;
		
	
		async function checkUserRole() {
			const getCheckThedsabanUser = await call.get('maechan.maechan.api.check_thedsaban_user_roles');
			setIsThedsabanUser(getCheckThedsabanUser.message);
		}
	
		useEffect(() => {
			checkUserRole();
			if (isThedsabanUser === false) {
				window.location.href = `/`
			}
		}, [isThedsabanUser]);
	
		return (
			<main>
				{isThedsabanUser && children}
			</main>
		);
	}
	

	
	const LoginGuard = ({ children }: React.PropsWithChildren) => {

		const auth = useFrappeAuth()
		const navigate = useNavigate()
		

		useEffect(() => {

			if (auth.isLoading) {

			} else {
				if (!auth.currentUser) {
					navigate("/login")
				}
			}
			
		}, [auth.isLoading])

		return (
			<main>
				{children}
			</main>
		)
	}

	const checkProfile = ({ children }: React.PropsWithChildren) => {
		const [profile, setprofile] = useState(null);
		let { call } = useContext(FrappeContext) as FrappeConfig;
		const navigate = useNavigate()
		
	
		async function checkUserRole() {
			const getCheckProfile = await call.get('maechan.maechan.doctype.userprofile.userprofile.check_current_userprofile');
			setprofile(getCheckProfile.message);
		}
	
		useEffect(() => {
			checkUserRole();
			if (profile === false) {
				navigate('/profile')
			}
		}, [profile]);
	
		return (
			<main>
				{profile && children}
			</main>
		);
	}


	
	return (
		<div className="App">

			<NextUIProvider>
				<FrappeProvider siteName={import.meta.env.VITE_FRAPPE_URL ?? ''} socketPort={import.meta.env.VITE_SOCKET_PORT ?? ''}>
					<AlertProvider>
						<AuthProvider>
							<BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
								<Routes>
									<Route path='/login' element={<Login />} />
									<Route path='/register' element={<Register />} />
									<Route path="/" element={<LoginGuard><CheckThedsabanUser><MainPage /></CheckThedsabanUser></LoginGuard>} >
										<Route index element={<Dashboard />} />

										<Route path="profile">
											<Route index element={<ProfilePage />} />
										</Route>

										<Route path="licenseRequest">
											<Route index element={<RequestLicense/>} />
											<Route path='create' element={<RequestLicenseCreate/>} />
											<Route path=':id/edit' element={<RequestLicenseEdit />} />
											<Route path=':id/view' element={<RequestLicenseView />} />
											<Route path=':id/inspect/:inspectId/view' element={<RequestInspectView />} />

											<Route path=':id/payment' element={<RequestLicensePayment />} />


										</Route>

										<Route path="pageLicense">
											<Route index element={<LicenseIndex />} />
											<Route path=':id/view' element={<LicenseView/>} />
										</Route>

										<Route path="business">
											<Route index element={<BusinessIndex />} />
											<Route path='create' element={<BusinessCreate />} />
											<Route path=':id/edit' element={<BusinessEdit />} />
										</Route>

									</Route>
								</Routes>
							</BrowserRouter>
						</AuthProvider>
					</AlertProvider>
				</FrappeProvider>
			</NextUIProvider>
		</div>
	)
}

export default App
