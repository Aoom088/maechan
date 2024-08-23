import { FrappeProvider, useFrappeAuth, FrappeConfig, FrappeContext } from 'frappe-react-sdk'
import { NextUIProvider } from "@nextui-org/react"
import React, { useEffect,useContext, useState }  from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/xlogin';
import Register from './components/xregister';
import Home from './components/home';
import AlertProvider from './providers/AlertProvider';
import AuthProvider from './providers/AuthProvider';

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

	console.log('test',import.meta.env.VITE_FRAPPE_URL ?? '')

	
	return (
		<div className="App">

			<NextUIProvider>
				<FrappeProvider url={import.meta.env.VITE_FRAPPE_URL ?? ''} socketPort={import.meta.env.VITE_SOCKET_PORT ?? ''}>
					<AlertProvider>
						<AuthProvider>
							<BrowserRouter>
								<Routes>
									<Route path='/login' element={<Login />} />
									<Route path='/register' element={<Register />} />
									<Route path="/" element={<LoginGuard><CheckThedsabanUser><Home/></CheckThedsabanUser></LoginGuard>} >
                    				<Route path='/home' element={<Home/>} />
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
