import React from 'react'
import { useNavigate } from 'react-router'
import Icon from "../../Assets/Images/logo.png"
import circleRing from "../../Assets/Images/circle-icon.png"

const AuthScreen = ({ content, path }: { content: string, path: string }) => {
    const navigate = useNavigate()

    const handleButtonAction = () => {
        navigate(`/${path}`);
    }
    return (
        <div className='min-h-fit sm:min-h-screen w-full'>
            <div className='flex flex-col px-[20px] sm:px-[150px] pt-[25%]'>
                <img src={Icon} className='sm:w-[114px] sm:h-[114px] my-4 mx-auto sm:mx-0' alt='logo'/>
                <h3 className='text-white font-medium my-4'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend elit a viverra euismod. Ut risus enim, scelerisque non pharetra a, egestas sit amet lectus. Phasellus tempor mi ut aliquam tristique.
                </h3>
                <button className='cursor-pointer border border-r-2 border-white bg-[#0575E6] w-fit text-white rounded-[30px] px-[30px] py-[8px] mt-6 z-[1000]' onClick={handleButtonAction}>
                    {content}
                </button>
            </div>
            <img src={circleRing} className='hidden sm:block sm:bottom-0 absolute mt-[20px] sm:w-[427px] h-auto' alt='circle-ring'/>
        </div>
    )
}

export default AuthScreen