import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'
import {NextUIProvider} from '@nextui-org/react'
import AlertProvider from './providers/AlertProvider';
import AuthProvider from './providers/AuthProvider';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Test from './page/test.tsx'
import Business from './page/business.tsx'
import LicenseDetail from './page/licenseDetail.tsx'
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
								<Route path='/test' element={<Test/>}/>
								<Route path='/business/:license_applicant_title' element={<Business/>}/>
								<Route path='/detail' element={<LicenseDetail/>}/>
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
