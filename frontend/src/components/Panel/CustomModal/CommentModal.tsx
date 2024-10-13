import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Table } from 'antd';
import { CommentColumns } from '../ManageUsers/Helper'

const CommentModal = ({ isModalOpen, closeModal }: {
    isModalOpen: number,
    closeModal: () => void
}) => {
    const [data, setData] = useState<any>([])
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        getCommentData()
    }, [])

    const getCommentData = async () => {
        setLoader(true)
        await fetch(process.env.REACT_APP_BASE_URL + "admin/faqs/" + isModalOpen + "/comments", {
            headers: {
                Authorization: localStorage.getItem("auth_token") ?? ""
            }
        }).then((res) => res.json()).then((response: any) => {
            if (response.success) {
                let temp: any = []
                if (response.comments.length) {
                    response.comments.map((item: any, index: number) => {
                        temp.push({
                            key: index + 1,
                            comment: item.comment,
                            email: item.user_email ?? "NA",
                            created_at: item.created_at,
                            action: <a href={'mailto:' + item.user_email} className='text-white bg-blue-600 font-[500] text-[14px] px-4 py-2 rounded-[20px]'>
                                Reply Now
                            </a>,
                        })
                    })
                }
                setData(temp)
            } else {
                toast.error(response.message ?? "Failed to get data", {
                    position: 'bottom-center',
                    autoClose: 3000
                })
            }
        }).finally(() => {
            setLoader(false)
        })
    }
    return (
        isModalOpen !== -1 ? (
            <div className="">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {/* Modal content */}
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg min-w-[820px] p-8 relative">
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
                            <div className='min-w-[750px] sm:w-[100%]'>
                                <h2 className='font-[700] text-[26px]'>Users Faq Comments</h2>

                                <div className='mx-auto flex flex-col min-w-[750px] mt-6'>

                                    <Table dataSource={data} columns={CommentColumns} pagination={false} loading={loader} scroll={{ x: true }} />
                                    {/* <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px] w-fit' onClick={closeModal}>Close</button> */}
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

export default CommentModal