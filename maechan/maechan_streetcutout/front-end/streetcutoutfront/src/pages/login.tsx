import { Button, Card, CardBody, Divider, Input, Spinner } from "@nextui-org/react";
import { UserPassCredentials, useFrappeAuth, FrappeError } from "frappe-react-sdk";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.png';

const LoginForm = (): JSX.Element => {
    const {
        currentUser,
        isLoading,
        login,
        logout,
        updateCurrentUser,
    } = useFrappeAuth();

    const [isLogin, setIsLogin] = useState(false);
    const [credential, setCredential] = useState({
        username: '',
        password: "",
    } as UserPassCredentials);
    const [loginError, setLoginError] = useState({
        message: ''
    } as FrappeError);

    const doLogin = async () => {
        await isLoginWrapper(async () => {
            try {
                setLoginError({ message: 'เกิดข้อผิดพลาด' } as FrappeError);
                let result = await login(credential);
                console.log('doLogin result', result);
            } catch (error) {
                console.log('doLogin error', error);
                setLoginError(error as FrappeError);
            }
        });
    };

    const isLoginWrapper = async (callback: () => Promise<void>) => {
        setIsLogin(true);
        await callback();
        setIsLogin(false);
    };

    const handleCredential = (key: string, value: string) => {
        setCredential({
            ...credential,
            [key]: value
        });
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            updateCurrentUser().then(() => {
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            });
        }
    }, [currentUser, updateCurrentUser, navigate]);

    if (isLoading) {
        return (
            <Card className="min-w-[300px] max-w-[350px] shadow-xl rounded-lg border border-gray-200 bg-white">
                <CardBody className="flex flex-col gap-4 justify-center items-center p-6">
                    <Spinner size="lg" />
                </CardBody>
            </Card>
        );
    } else {
        if (currentUser) {
            return (
                <Card className="min-w-[300px] max-w-[350px] shadow-xl rounded-lg border border-gray-100 bg-gray-50">
                    <CardBody className="flex flex-col gap-4 justify-center items-center p-6">
                        <div className="text-lg font-semibold text-gray-800">สวัสดี {currentUser}</div>
                        <Spinner size="lg" />
                        <div>กำลังเข้าสู่ระบบ</div>
                    </CardBody>
                </Card>
            );
        } else {
            return (
                <form onSubmit={doLogin}>
                    <Card className="min-w-[300px] max-w-[350px] shadow-xl rounded-lg border border-gray-200 bg-white">
                        <CardBody className="flex flex-col gap-4 justify-center items-center p-6">
                             <img src={Logo} alt="Logo" className="w-24 h-24 mb-4" />
                            <div className="text-xl font-semibold text-gray-800">ยินดีต้อนรับเข้าสู่ระบบ</div>
                        <Input
                            isInvalid={loginError?.message !== ''}
                            color={loginError?.message !== '' ? "danger" : "default"}
                            errorMessage={loginError?.message}
                            type="email"
                            value={credential.username}
                            placeholder="ชื่อผู้ใช้"
                            name="username"
                            onValueChange={(value) => handleCredential('username', value)}
                            className="w-full border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-100 focus:border-transparent focus:border-blue-600 focus:ring-blue-600 focus:outline-none py-2 px-3 transition duration-300 ease-in-out"
                             />
                        <Input
                            isInvalid={loginError?.message !== ''}
                            color={loginError?.message !== '' ? "danger" : "default"}
                            errorMessage={loginError?.message}
                            type="password"
                            defaultValue={credential.password}
                            placeholder="กรุณากรอกรหัสผ่าน"
                            name="password"
                            onValueChange={(value) => handleCredential('password', value)}
                            className="w-full border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600 focus:outline-none py-2 px-3 transition duration-300 ease-in-out"
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                color="primary"
                                isLoading={isLogin}
                                onClick={doLogin}
                            >
                                เข้าสู่ระบบ
                            </Button>

                            <Divider className="my-4 border-gray-500 border-1"/>

                            <Button
                                type="button"
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-300"
                                color="default"
                                isLoading={isLogin}
                                onClick={() => { navigate("/register"); }}
                            >
                                สมัครสมาชิก
                            </Button>
                        </CardBody>
                    </Card>
                </form>
            );
        }
    }
};

function Login() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <LoginForm />
        </div>
    );
}

export default Login;