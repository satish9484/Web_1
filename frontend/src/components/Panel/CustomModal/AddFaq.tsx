import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const AddFaq = (
    { isModalOpen,
        modalData,
        closeModal,
        getFaqData
    }:
        {
            isModalOpen: boolean,
            modalData: any
            closeModal: () => void,
            getFaqData: () => void
        }) => {

    const [question, setQuestion] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const registerAction = async () => {
        const validate = registerValidator()
        if (validate.success) {
            await fetch(process.env.REACT_APP_BASE_URL + "admin/faqs", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": localStorage.getItem("auth_token") ?? ""
                },
                body: JSON.stringify({ question, answer })
            }).then((res) => res.json()).then((response) => {
                if (response.success) {
                    toast.success("Registered Successfully", {
                        position: 'bottom-center',
                        autoClose: 3000
                    })
                    setQuestion("")
                    setAnswer("")
                    closeModal()
                    getFaqData()
                } else {
                    toast.error(response.message ?? "Failed to login", {
                        position: 'bottom-center',
                        autoClose: 3000
                    })
                }
            })
        } else {
            toast.error(validate.message, {
                position: 'bottom-center',
                autoClose: 3000
            })
        }
    }

    const registerValidator = () => {
        if (!question || question.trim().length === 0) {
            return { 'success': false, 'message': "Question is missing", code: "question" }
        }

        if (!answer || answer.trim().length === 0) {
            return { 'success': false, 'message': "Answer is invalid or missing", code: "answer" }
        }
        return { 'success': true, 'message': "All Ok" }
    }

    useEffect(() => {
        if (isModalOpen && Object.keys(modalData).length > 0) {
            setQuestion(modalData.question)
            setAnswer(modalData.answer)
        } else {
            setQuestion("")
            setAnswer("")
        }
    }, [isModalOpen])


    const updateAction = async () => {
        const validate = registerValidator()
        if (validate.success) {
            setLoading(true)
            await fetch(process.env.REACT_APP_BASE_URL + "admin/faqs/" + modalData.id, {
                method: "PUT",
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: localStorage.getItem("auth_token") ?? ""
                },
                body: JSON.stringify({ question, answer })
            }).then((res) => res.json()).then((response) => {
                if (response.success) {
                    toast.success(response.message ?? "Updated successfully", {
                        position: "bottom-center",
                        autoClose: 3000
                    })
                    setQuestion("")
                    setAnswer("")
                    getFaqData()
                } else {
                    toast.error(response.message ?? "Failed to update data", {
                        position: "bottom-center",
                        autoClose: 3000
                    })
                }
            }).finally(() => {
                setLoading(false)
                closeModal()
            })
        } else {
            toast.error(validate.message, {
                position: 'bottom-center',
                autoClose: 3000
            })
        }
    }


    return (
        isModalOpen ? (
            <div className="">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                                <h2 className='font-[700] text-[26px]'>Add New Faq Form</h2>

                                <div className='mx-auto flex flex-col w-full mt-6'>
                                    <div className="relative mb-6">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g opacity="0.3">
                                                    <path d="M4.5 4.5C4.5 6.981 6.519 9 9 9C11.481 9 13.5 6.981 13.5 4.5C13.5 2.019 11.481 0 9 0C6.519 0 4.5 2.019 4.5 4.5ZM17 19H18V18C18 14.141 14.859 11 11 11H7C3.14 11 0 14.141 0 18V19H17Z" fill="#333333" />
                                                </g>
                                            </svg>
                                        </div>
                                        <input type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5" placeholder="Enter Question" onChange={(e) => setQuestion(e.target.value)} value={question} />
                                    </div>
                                    <div className="relative mb-6">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g opacity="0.3">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.5 5.25L2.25 4.5H21.75L22.5 5.25V18.75L21.75 19.5H2.25L1.5 18.75V5.25ZM3 6.8025V18H21V6.804L12.465 13.35H11.55L3 6.8025ZM19.545 6H4.455L12 11.8035L19.545 6Z" fill="#333333" />
                                                </g>
                                            </svg>

                                        </div>
                                        <input type="email" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5" placeholder="Enter Answer" onChange={(e) => setAnswer(e.target.value)} value={answer} />
                                    </div>

                                    {Object.keys(modalData).length > 0 ? <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px]' onClick={updateAction}>Update</button> :
                                        <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px]' onClick={registerAction}>Create</button>}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        ) : <></>
    )
}

export default AddFaq