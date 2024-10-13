import React, { useEffect, useState } from 'react'
import { WebIcon } from '../../../Assets/Icons/Icon';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';
import { useNavigate } from 'react-router';

const UrlDetector = () => {
    const navigate = useNavigate()
    const [userName, setUsername] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    // const [selectedModal, setSelectedModal] = useState<string>("");
    const [showReport, setShowReport] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [reportMessage, setReportMessage] = useState<string>("");

    useEffect(() => {
        let name = localStorage.getItem("name")
        if (name && name.trim().length) {
            setUsername(name)
        } else {
            setUsername("")
        }
    }, [])

    const getReport = async () => {
        let validate = validator()
        if (validate.success) {
            setLoading(true)
            setShowReport(false)
            await fetch(process.env.REACT_APP_BASE_URL + "ml/predict", {
                method: "POST",
                headers: {
                    "Authorization": localStorage.getItem("auth_token") ?? "",
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ url: url })
            }).then(res => res.json()).then((response) => {
                if (response.success) {
                    setShowReport(true)
                    setReportMessage(response.result)
                } else {
                    toast.error(response.message, {
                        position: "bottom-center",
                        autoClose: 3000
                    })
                }
            }).finally(() => { setLoading(false) })
        } else {
            toast.error(validate.message, {
                position: "bottom-center",
                autoClose: 3000
            })
        }
    }

    const validator = () => {
        if (!url || url.trim().length === 0) {
            return { "success": false, "message": "Url is Missing" }
        }

        // if (selectedModal === "") {
        //     return { "success": false, "message": "Please select modal" }
        // }

        return { "success": true, "message": "Pass" }
    }

    const learnMoreAction = () => {
        navigate("/panel/learn-more", { state: { url: url } })
    }

    return <div className='w-full h-full overflow-y-auto hide-scrollbar'>
        <h2 className='text-[32px] font-[700]'>Welcome {userName} !</h2>
        <hr className='my-4 h-[2px] border-none bg-[#0575E6]' />

        {/* Form Section */}
        <div className='mx-auto flex flex-col w-1/2 justify-center h-96'>
            <p className='my-4'>Website Url</p>
            <div className="relative mb-6">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <WebIcon />
                </div>
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5"
                    placeholder="Enter url address"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                />
            </div>
            {/* <div className="relative mb-6">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <WebIcon />
                </div>
                <select
                    id="vehicle-select"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5"
                    value={selectedModal}
                    onChange={(e) => setSelectedModal(e.target.value)}
                >
                    <option value="" disabled selected hidden>
                        Select Model
                    </option>
                    <option value="knn">KNN Model</option>
                    <option value="svc">SVC Model</option>
                </select>
            </div> */}

            {loading ? <Spin /> :
                <button
                    className='w-fit border border-white bg-[#0575E6] text-[16px] text-white py-[10px] px-[32px] rounded-[30px] mx-auto'
                    onClick={getReport}>
                    Submit
                </button>}
        </div>

        {/* Report Section */}
        {showReport && (
            <div className="bg-custom-gradient mx-auto flex flex-col w-[80%] justify-center rounded-[30px] mb-10 max-h-[600px] overflow-auto"> {/* Added max height and scroll */}
                <div className='flex flex-col mx-auto'>
                    <div className='w-full text-white min-h-52 items-center justify-center flex flex-row'>
                        {reportMessage === "Not Safe" ?
                            <h2 className='text-[32px] font-[500] text-red-600'>{reportMessage}</h2> :
                            <h2 className='text-[32px] font-[500] text-green-500'>{reportMessage}</h2>
                        }
                    </div>
                    <button
                        onClick={learnMoreAction}
                        className='w-fit border border-white bg-[#0575E6] text-[16px] text-white py-[10px] px-[32px] rounded-[30px] mx-auto mb-8'>
                        Learn More
                    </button>
                </div>

            </div>
        )}
        <ToastContainer />
    </div>
}

export default UrlDetector