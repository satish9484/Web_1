import { Spin } from 'antd';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import { WebIcon } from '../../../Assets/Icons/Icon';

const AskQueries = () => {
    const [loader, setLoader] = useState<boolean>(false)
    const [subject, setSubject] = useState<string>("")
    const [body, setBody] = useState<string>("")

    const submitAction = async () => {
        let validate = submitValidator()
        if (validate.success) {
            setLoader(true)
            await fetch(process.env.REACT_APP_BASE_URL + "user_query/queries", {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem("auth_token") ?? "",
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ subject, body })
            }).then((res) => res.json()).then((response: any) => {
                if (response.success) {
                    toast.success(response.message ?? "Submitted Successfully", {
                        position: 'bottom-center',
                        autoClose: 3000
                    })

                    setSubject("")
                    setBody("")
                } else {
                    toast.error("Failed to submit In Successfully", {
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


    const submitValidator = () => {
        if (!subject || subject.trim().length === 0) {
            return { 'success': false, 'message': "Query subject is invalid or missing" }
        }

        if (!body || body.trim().length === 0) {
            return { 'success': false, 'message': "Query body is missing" }
        }

        return { 'success': true, 'message': "All Ok" }
    }

    return (
        <React.Fragment>
            {loader ? <div className='flex flex-col justify-center'>
                <h2 className='text-[44px] text-center mt-6'>Loading ...</h2>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div> : <div className='w-full h-full overflow-y-auto hide-scrollbar'>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <h2 className='text-[32px] font-[700]'>Ask Queries</h2>
                    </div>
                </div>
                <hr className='my-4 h-[2px] border-none bg-[#0575E6]' />

                <div className='mx-auto flex flex-col w-1/2 justify-center h-96'>
                    <p className='my-4'>Query Subject</p>
                    <div className="relative mb-2">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <WebIcon />
                        </div>
                        <input
                            type="text"
                            id="input-group-1"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5"
                            placeholder="Enter query subject"
                            onChange={(e) => setSubject(e.target.value)}
                            value={subject}
                        />
                    </div>
                    <p className='my-4'>Query Body</p>
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <WebIcon />
                        </div>
                        <input
                            type="text"
                            id="input-group-12"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5"
                            placeholder="Enter query body"
                            onChange={(e) => setBody(e.target.value)}
                            value={body}
                        />
                    </div>


                    {loader ? <Spin /> :
                        <button
                            className='w-fit border border-white bg-[#0575E6] text-[16px] text-white py-[10px] px-[32px] rounded-[30px] mx-auto'
                            onClick={submitAction}>
                            Submit
                        </button>}
                </div>

            </div>}
            <ToastContainer />
        </React.Fragment>
    )
}

export default AskQueries