import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import AddFaq from '../CustomModal/AddFaq';
import CommentModal from '../CustomModal/CommentModal';

const AdminFaq = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([])
    const [openCommentModal, setOpenCommentModal] = useState<number>(-1);
    const [modalData, setModalData] = useState<any>({})
    const [openFaqModal, setOpenFaqModal] = useState<boolean>(false)

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

    const updateFaq = async (item: { question: string, answer: string, id: string }) => {
        setLoading(true)
        setModalData({ question: item.question, answer: item.answer, id: item.id })
        setOpenFaqModal(true)
    }

    const deleteFaq = async (key: number) => {
        setLoading(true)
        await fetch(process.env.REACT_BASE_APP_URL + "admin/faqs/" + key, {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("auth_token") ?? ""
            }
        }).then((res) => res.json()).then((response: any) => {
            if (response.success) {
                toast.success(response.message ?? "Updated successfully", {
                    position: "bottom-center",
                    autoClose: 3000
                })
            } else {
                toast.error(response.message ?? "Failed to update data", {
                    position: "bottom-center",
                    autoClose: 3000
                })
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const addFaqModal = () => {
        setOpenFaqModal(true)
    }

    const closeFaqModal = () => {
        setOpenFaqModal(false)
        setModalData({})
    }

    const closeCommentModal = () => {
        setOpenCommentModal(-1)
    }

    return (
        <div className='w-full h-full overflow-y-auto hide-scrollbar'>
            <div className='w-full flex flex-row justify-between flex-wrap mt-4 mb-6'>
                <h2 className='text-[32px] font-[700]'>FAQ</h2>
                <button onClick={addFaqModal} className='bg-green-500 text-white text-[16px] font-500 px-4 py-2 rounded-[20px] h-fit cursor-pointer'>Add Faqs</button>
            </div>
            <hr className='my-4 h-[2px] border-none bg-[#0575E6]' />
            <div className='flex flex-row justify-center'>
                <div className='w-[100%] mt-6'>
                    {data.map((item: any, index: number) => {
                        return <div className='' key={index + "f_aw"}>
                            <div className='flex flex-row justify-end pr-4 mb-2'>
                                <button onClick={() => updateFaq(item)} className='text-blue-600 underline text-[14px]'>Edit</button>
                                <button onClick={() => deleteFaq(item.id)} className='text-red-600 underline text-[14px] ml-2'>Delete</button>
                                <button onClick={() => setOpenCommentModal(item.id)} className='text-gray-600 underline text-[14px] ml-2'>View Comment</button>
                            </div>
                            <div className='bg-slate-300 rounded-[30px] px-[30px] py-[10px] mb-2'>
                                <div className='flex flex-row justify-between'>
                                    <h3 className='text-[20px] font-[500]'>{item.key + ". " + item.question}</h3>
                                </div>
                                {/* {activeIndex === item.key && <p className='text-[18px] font-[400] mt-2 ml-4'>{item.answer}</p>} */}
                                <p className='text-[18px] font-[400] mt-2 ml-4'>{item.answer}</p>
                                {/* <hr /> */}
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <AddFaq isModalOpen={openFaqModal} modalData={modalData} closeModal={closeFaqModal} getFaqData={getFaqData} />
            {openCommentModal !== -1 && <CommentModal isModalOpen={openCommentModal} closeModal={closeCommentModal} />}
            <ToastContainer />
        </div>
    )
}

export default AdminFaq