import React, { useEffect, useState } from 'react'

const CustomGraph = () => {
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        await fetch(process.env.REACT_APP_BASE_URL + "ml/get-report", {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("auth_token") ?? ""
            }
        }).then(res => res.text()).then((response) => {
            setHtmlContent(response)
        })
    }
    return (
        <React.Fragment>
            <div className='w-full h-full overflow-y-auto hide-scrollbar'>
                <div className='w-full flex flex-row justify-between flex-wrap mt-4 mb-6'>
                    <div>
                        <h2 className='text-[32px] font-[700]'>ML Graph</h2>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CustomGraph