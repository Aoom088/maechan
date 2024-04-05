import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import React, { useEffect } from 'react';
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
function App() {


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
									<Route path="/" element={<LoginGuard><MainPage /></LoginGuard>} >
										<Route index element={<Dashboard />} />

										<Route path="profile">
											<Route index element={<ProfilePage />} />
										</Route>

										<Route path="licenseRequest">
											<Route index element={<RequestLicense/>} />
											<Route path='create' element={<RequestLicenseCreate/>} />
											<Route path=':id/edit' element={<RequestLicenseEdit />} />

										</Route>

										<Route path="license">
											<Route index element={<LicenseDashboard />} />
											<Route path='requestLicense' element={<RequestLicense/>} />
											<Route path='requestStatus' element={<h1>สร้างคำร้องขอใบอนุญาต</h1>} />

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
