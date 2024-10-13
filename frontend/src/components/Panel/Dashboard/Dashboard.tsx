import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { DataType, columns, formatDate } from './helper';
import { SearchIcon } from '../../../Assets/Icons/Icon';
import Icon from "../../../Assets/Images/logo.png"
import PremiumModal from '../CustomModal/PremiumModal';



const Dashboard: React.FC = () => {
  const [rowData, setRowData] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{}>({});

  useEffect(() => {
    getUsersData()
  }, [])

  const openModalAction = (data: {}) => {
    setModalData(data)
    setIsModalOpen(true)
  }

  const getUsersData = async (email: string = "") => {
    setLoader(true)
    await fetch(process.env.REACT_APP_BASE_URL + "admin/users", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("auth_token") ?? ""
      }
    }).then(res => res.json()).then((response) => {
      if (response.success) {
        let extractUsersData = []
        if (email === "") {
          extractUsersData = response.users_data.filter((item: any) => item.role === "user")
        } else {
          extractUsersData = response.users_data.filter((item: any) => item.role === "user" && item.email.includes(email))
        }

        let temp: DataType[] = []
        extractUsersData.map((item: any, index: number) => {
          temp.push({
            key: (index + 1).toString(),
            name: item.full_name ?? "Not Available",
            url: item.url ?? "Not Available",
            email: item.email ?? "Not Available",
            action: <Button type="primary" onClick={() => openModalAction(item)}>View</Button>,
          })
        })
        setRowData(temp)
      } else {
        toast.error(response.message, {
          position: "bottom-center",
          autoClose: 3000
        })
      }
    }).finally(() => { setLoader(false) })
  }

  const searchData = () => {
    // if (searchText.trim().length) {
    getUsersData(searchText)
    // }
  }

  const closeModal = () => setIsModalOpen(false);

  return (
    <React.Fragment>

      <div className='w-full flex flex-row justify-between flex-wrap mt-4 mb-6'>
        <div>
          <h2 className='text-[32px] font-[700]'>Welcome, {localStorage.getItem("name")}</h2>
          <p>{formatDate()}</p>
        </div>
        <div className='flex flex-row'>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              id="input-group-1"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full ps-12 p-2.5" placeholder="Search Email"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              onKeyDown={(keyValue) => keyValue.key === "Enter" && searchData()}
            />
          </div>
          <div className='bg-[#0575E6] rounded-[12px] h-fit ml-6'>
            <img src={Icon} className='sm:w-[38px] sm:h-[38px] mx-auto sm:mx-0' alt='logo' />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <Table dataSource={rowData} columns={columns} pagination={false} loading={loader} />
        <ToastContainer />
        <PremiumModal isModalOpen={isModalOpen} modalData={modalData} closeModal={closeModal} />
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
