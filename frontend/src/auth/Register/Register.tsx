import React, { useState } from 'react'
import AuthScreen from '../helper/AuthScreen'
import circleRing from "../../Assets/Images/circleRingReverse.png"
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import { Spin } from 'antd';

const Register = () => {
    const navigate = useNavigate()
    const [loader, setLoader] = useState<boolean>(false);
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const registerAction = async () => {
        const validate = registerValidator()
        if (validate.success) {
            setLoader(true);
            await fetch(process.env.REACT_APP_BASE_URL + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ email, password, full_name: name })
            }).then((res) => res.json()).then((response) => {
                if (response.success) {
                    toast.success("Registered Successfully", {
                        position: 'bottom-center',
                        autoClose: 3000
                    })
                    setName("")
                    setEmail("")
                    setPassword("")
                } else {
                    toast.error(response.message ?? "Failed to login", {
                        position: 'bottom-center',
                        autoClose: 3000
                    })
                }
            }).finally(() => setLoader(false))
        } else {
            toast.error(validate.message, {
                position: 'bottom-center',
                autoClose: 3000
            })
        }

    }

    const registerValidator = () => {
        if (!name || name.trim().length === 0) {
            return { 'success': false, 'message': "Name is missing", code: "name" }
        }

        if (!email || email.trim().length === 0) {
            return { 'success': false, 'message': "Email is invalid or missing", code: "email" }
        }

        if (!password || password.trim().length === 0) {
            return { 'success': false, 'message': "Password is invalid pr missing", code: "password" }
        }

        return { 'success': true, 'message': "All Ok" }
    }

    return <div className='flex flex-row w-full min-h-screen flex-wrap'>
        <div className="w-[100%] sm:w-[60%] bg-custom-gradient">
            <AuthScreen content="Login Here" path="login" />
        </div>
        <div className="flex flex-row w-[100%] sm:w-[40%] items-center justify-center mx-auto">
            <img src={circleRing} className='top-[-80px] sm:top-[-140px] right-0 absolute w-[227px] sm:w-[427px] h-auto' alt='circle-ring' />
            <div className='w-[90%] sm:w-[60%]'>
                <h2 className='font-[700] text-[26px]'>Hello</h2>
                <p>Sign Up to Get Started</p>

                <div className='mx-auto flex flex-col w-full mt-6'>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.3">
                                    <path d="M4.5 4.5C4.5 6.981 6.519 9 9 9C11.481 9 13.5 6.981 13.5 4.5C13.5 2.019 11.481 0 9 0C6.519 0 4.5 2.019 4.5 4.5ZM17 19H18V18C18 14.141 14.859 11 11 11H7C3.14 11 0 14.141 0 18V19H17Z" fill="#333333" />
                                </g>
                            </svg>
                        </div>
                        <input type="text" id="resgister-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5" placeholder="Full Name" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.3">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.5 5.25L2.25 4.5H21.75L22.5 5.25V18.75L21.75 19.5H2.25L1.5 18.75V5.25ZM3 6.8025V18H21V6.804L12.465 13.35H11.55L3 6.8025ZM19.545 6H4.455L12 11.8035L19.545 6Z" fill="#333333" />
                                </g>
                            </svg>

                        </div>
                        <input type="email" id="register-group-12" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} value={email} />
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.3">
                                    <path d="M20 12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7Z" fill="#333333" />
                                </g>
                            </svg>

                        </div>
                        <input type="password" id="register-group-123" className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full ps-12 p-2.5" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </div>

                    {loader ? <Spin /> : <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px]' onClick={registerAction}>Register</button>}
                </div>
            </div>

        </div>
        <ToastContainer />
    </div>
}

export default Register