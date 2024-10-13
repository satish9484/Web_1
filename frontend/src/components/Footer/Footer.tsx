import React from 'react'
import { CallIcon, EmailIcon, FacbookIcon, LinkedIn, LocationIcon, TwitterIcon } from '../../Assets/Icons/Icon'
import ClixoLogo from "../../Assets/Images/Clixo_logo_footer.png"

const socialMedia = [
    { id: 1, logo: <FacbookIcon />, name: "FacbookIcon", content: "hello@Clixo.com" },
    { id: 2, logo: <TwitterIcon />, name: "TwitterIcon", content: "+91 91813 23 2309" },
    { id: 3, logo: <LinkedIn />, name: "LinkedIn", content: "Somewhere in the World" }
]

const contactIcon = [
    { id: 1, logo: <EmailIcon />, name: "EmailIcon", content: "hello@Clixo.com" },
    { id: 2, logo: <CallIcon />, name: "CallIcon", content: "+91 91813 23 2309" },
    { id: 3, logo: <LocationIcon />, name: "LocationIcon", content: "Somewhere in the World" }
]

const footerNavs = [
    { id: 1, name: "Home", link: "#" },
    { id: 2, name: "Services", link: "#" },
    { id: 3, name: "Elite Growth Plan", link: "#" },
    { id: 4, name: "Early Stage Plan", link: "#" },
    { id: 5, name: "About", link: "#" },
    { id: 6, name: "Terms", link: "#" },
    { id: 7, name: "Privacy", link: "#" }
]

const Footer = () => {
    const screenWidth = window.innerWidth;
    
    return <div className='flex flex-col mx-auto w-[90%] mt-6'>
        <div className="flex flex-row mt-8 mb-6 items-center flex-wrap">
            <div className='flex flex-row justify-center sm:justify-between w-[100%] sm:w-[70%] flex-wrap'>
                <div className='ml-[-28px]'>
                    {/* <FooterLogo /> */}
                </div>
                {screenWidth > 600 && <div className='flex flex-row mr-4 items-center'>
                    {footerNavs.map((item) => {
                        return <a href={item.link} className='text-white mr-4 text-[14px]'>{(item.name).toUpperCase()}</a>
                    })}
                </div>}
            </div>
            <div className='w-[100%] sm:w-[30%] flex flex-row border border-[#262626] py-[10px] pl-[20px] pr-[20px] justify-between rounded-[8px] items-center'>
                <p className='text-white text-[16px] font-[500]'>Stay Connected</p>
                {/* <div className='flex flex-row justify-between'> */}
                {socialMedia.map((item, index) => {
                    return <div className='border border-[#2E2E2E] p-[16px] rounded-[6px] bg-gradient-to-t from-[#161712] to-[#2A2C14]' key={index + "_icons"}>
                        {item.logo}
                    </div>
                })}
                {/* </div> */}
            </div>
        </div>
        <hr />
        <div className='flex flex-row justify-between mt-10 mb-6 flex-wrap'>
            <div className='flex flex-row items-center flex-wrap justify-center'>
                {contactIcon.map((item, index) => {
                    return <div className='flex flex-row mr-4 items-center mb-4 sm:mb-0'>
                        {item.logo}
                        <p className='text-white ml-2'>
                            {item.content}
                        </p>
                    </div>

                })}
            </div>
            <div className='mx-auto sm:mx-0'>
                <p className='text-white '>© 2024 Clixo. All rights reserved.</p>
            </div>
        </div>
    </div>
}

export default Footer