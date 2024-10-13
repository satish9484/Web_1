import { Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';

const QueriesColumns = [
  {
    title: 'S.No',
    dataIndex: 'key',
    key: 'key'
  },
  {
    title: 'Subject',
    dataIndex: 'sub',
    key: 'sub',
  },
  {
    title: 'Body',
    dataIndex: 'body',
    key: 'body',
  },
  {
    title: 'User Email',
    dataIndex: 'user_email',
    key: 'user_email',
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];

const ViewUserQueries = () => {
  const [loader, setLoader] = useState<boolean>(true)
  const [submitLoader, setSubmitLoader] = useState<boolean>(false)
  const [commentsData, setCommentsData] = useState<any>([])
  const [replyField, setReplyField] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<number>(-1)

  useEffect(() => {
    getCommentsData()
  }, [])

  const getCommentsData = async () => {
    await fetch(process.env.REACT_APP_BASE_URL + "user_query/queries", {
      headers: {
        Authorization: localStorage.getItem("auth_token") ?? ""
      }
    }).then((res) => res.json()).then((response: any) => {
      if (response.success) {
        if (response.queries && response.queries.length) {
          let temp: any = []
          response.queries.map((item: any, index: number) => {
            temp.push({
              key: item.id,
              sub: item.subject,
              body: item.body,
              user_email: item.user_email,
              created_at: item.timestamp,
              action: <button onClick={() => setIsModalOpen(item.id)} className='text-white bg-blue-600 font-[500] text-[14px] px-4 py-2 rounded-[20px]'>
                Reply
              </button>
            })
          })
          setCommentsData(temp)
        }
      } else {
        toast.error(response.message, {
          position: 'bottom-center',
          autoClose: 3000
        })
      }

    }).finally(() => setLoader(false))
  }

  const closeModal = () => {
    setIsModalOpen(-1)
  }

  const submitQuery = async () => {
    setSubmitLoader(true)
    await fetch(process.env.REACT_APP_BASE_URL + "user_query/reply/" + isModalOpen, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        Authorization: localStorage.getItem("auth_token") ?? ""
      },
      body: JSON.stringify({ reply: replyField })
    }).then((res) => res.json()).then((response: any) => {
      if (response.success) {
        toast.success(response.message ?? "Replied Successfully", {
          position: 'bottom-center',
          autoClose: 3000
        })
        closeModal()
        setReplyField("")
      } else {
        toast.error(response.message, {
          position: 'bottom-center',
          autoClose: 3000
        })
      }
    }).finally(() => setSubmitLoader(false))
  }

  return (
    <React.Fragment>
      {loader ? <div className='flex flex-col justify-center'>
        <h2 className='text-[44px] text-center mt-6'>Loading ...</h2>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div> : <div className='w-full h-full overflow-y-auto hide-scrollbar'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col'>
            <h2 className='text-[32px] font-[700]'>Faq Comments</h2>
            {/* <p className='text-[24px] bg-lime-300 w-fit rounded-[30px] px-[20px] my-4'>{location.state.url}</p> */}
          </div>
        </div>

        <hr className='my-4 h-[2px] border-none bg-[#0575E6]' />
        <div className='mx-auto flex flex-col min-w-[750px] mt-6'>

          <Table dataSource={commentsData} columns={QueriesColumns} pagination={false} loading={loader} scroll={{ x: true }} />
          {/* <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px] w-fit' onClick={closeModal}>Close</button> */}
        </div>
      </div>}

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
              <h2 className='font-[700] text-[26px]'>Query Reply Form</h2>

              <div className='mx-auto flex flex-col w-full mt-6'>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.3">
                        <path d="M4.5 4.5C4.5 6.981 6.519 9 9 9C11.481 9 13.5 6.981 13.5 4.5C13.5 2.019 11.481 0 9 0C6.519 0 4.5 2.019 4.5 4.5ZM17 19H18V18C18 14.141 14.859 11 11 11H7C3.14 11 0 14.141 0 18V19H17Z" fill="#333333" />
                      </g>
                    </svg>
                  </div>
                  <input type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5" placeholder="Reply Query" onChange={(e) => setReplyField(e.target.value)} value={replyField} />
                </div>
                {submitLoader ? <Spin /> : <button className='text-white bg-[#0575E6] px-[26px] py-[18px] rounded-[30px]' onClick={submitQuery}>Send</button>}
              </div>
            </div>

          </div>
        </div>
      </div>}
      <ToastContainer />
    </React.Fragment>
  )
}

export default ViewUserQueries