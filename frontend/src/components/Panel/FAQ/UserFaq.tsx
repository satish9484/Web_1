import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { MinusIcon, PlusIcon } from '../../../Assets/Icons/Icon';

const UserFaq = () => {
    const [data, setData] = useState<any>([])
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    const [loading, setLoading] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<number>(-1)
    const [commentValue, setCommentValue] = useState<string>("")

    useEffect(() => {
        getFaqData()
    }, [])

    const getFaqData = async () => {
        setLoading(true)
        await fetch(process.env.REACT_APP_BASE_URL + "admin/faqs", {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("auth_token") ?? ""
            },
        }).then(res => res.json()).then((response) => {
            if (response.success) {
                if (response.faqs.length) {
                    let temp: any = []
                    response.faqs.map((item: any, index: number) => {
                        temp.push({
                            question: item.question,
                            answer: item.answer,
                            id: item.id,
                            key: index + 1
                        })
                    })
                    setData(temp)
                }
            } else {
                toast.error(response.message, {
                    position: "bottom-center",
                    autoClose: 3000
                })
            }
        }).finally(() => { setLoading(false) })
    }

    const openModal = (item: any) => {
        setIsModalOpen(item)
    }

    const addComment = async () => {
        if(commentValue.trim().length === 0) {
            toast.error("Please write something", {
                position: "bottom-center",
                autoClose: 3000
            })
            return false;
        }
        await fetch(process.env.REACT_APP_BASE_URL + "admin/faqs/" + isModalOpen + "/comment", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": localStorage.getItem("auth_token") ?? ""
            },
            body: JSON.stringify({ comment : commentValue })
        }).then(res => res.json()).then((response) => {
            if (response.success) {
                toast.success("Comment sent successfully", {
                    position: "bottom-center",
                    autoClose: 3000
                })
                setIsModalOpen(-1)
                setCommentValue("")
            } else {
                toast.error(response.message, {
                    position: "bottom-center",
                    autoClose: 3000
                })
            }
        }).finally(() => { })
    }

    const closeModal = () => {
        setIsModalOpen(-1)
    }

    return (
        <div className='w-full h-full overflow-y-auto hide-scrollbar'>
            <h2 className='text-[32px] font-[700]'>FAQ</h2>
            <hr className='my-4 h-[2px] border-none bg-[#0575E6]' />
            <div className='flex flex-row justify-center'>
                <div className='w-[90%] mt-6'>
                    {data.map((item: any, index: number) => {
                        return <div className='' key={index + "user_faq"}>
                            <div className='flex flex-row justify-end pr-4 mb-2'>
                                <button onClick={() => openModal(item.id)} className='text-blue-600 underline text-[14px]'>Ask Queries</button>
                            </div>
                            <div className=' bg-slate-300  rounded-[30px] px-[30px] py-[10px] mb-2'>
                                <div className='flex flex-row justify-between'>
                                    <h3 className='text-[18px] font-[500]'>{item.key + ". " + item.question}</h3>
                                    {activeIndex !== item.key ? <span className='cursor-pointer' onClick={() => setActiveIndex(item.key)}>
                                        <PlusIcon />
                                    </span> :
                                        <span className='cursor-pointer' onClick={() => setActiveIndex(-1)}>
                                            <MinusIcon />
                                        </span>}
                                </div>
                                {activeIndex === item.key && <p className='text-[16px] font-[400] mt-2 ml-4'>{item.answer}</p>}
                                {/* <hr /> */}
                            </div>
                        </div>
                    })}
                </div>
            </div>
            {isModalOpen !== -1 && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {/* Modal content */}
                <div className="bg-white rounded-xl shadow-2xl max-w-lg min-w-[500px] p-8 relative">
                    {/* Close button */}
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-300 ease-in-out"
                        onClick={closeModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-row w-[100%] sm:w-[100%] items-center justify-center mx-auto">
                        <div className='w-[90%] sm:w-[100%]'>
                            <h2 className='font-[700] text-[26px]'>Doubt Form</h2>

                            <div className='mx-auto flex flex-col w-full mt-6'>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g opacity="0.3">
                                                <path d="M4.5 4.5C4.5 6.981 6.519 9 9 9C11.481 9 13.5 6.981 13.5 4.5C13.5 2.019 11.481 0 9 0C6.519 0 4.5 2.019 4.5 4.5ZM17 19H18V18C18 14.141 14.859 11 11 11H7C3.14 11 0 14.141 0 18V19H17Z" fill="#333333" />
                                            </g>
                                        </svg>
                                    </div>
                                    <input type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5" placeholder="Ask Question" onChange={(e) => setCommentValue(e.target.value)} value={commentValue} />
                                </div>
                                <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px]' onClick={addComment}>Send</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>}
            <ToastContainer />
        </div>
    )
}

export default UserFaq