

import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { DataType, columns, formatDate } from './Helper';
import { SearchIcon } from '../../../Assets/Icons/Icon';
import Icon from "../../../Assets/Images/logo.png"
import AddUser from '../CustomModal/AddUser';



const ManageUser: React.FC = () => {
  const [rowData, setRowData] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({})

  useEffect(() => {
    getUsersData()
  }, [])

  const getUsersData = async () => {
    setLoader(true)
    await fetch(process.env.REACT_APP_BASE_URL + "admin/users", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("auth_token") ?? ""
      }
    }).then(res => res.json()).then((response) => {
      if (response.success) {
        let extractUsersData = []
        extractUsersData = response.users_data.filter((item: any) => item.role === "user")

        let temp: DataType[] = []
        extractUsersData.map((item: any, index: number) => {
          temp.push({
            key: (index + 1).toString(),
            name: item.full_name ?? "Not Available",
            url: item.url ?? "Not Available",
            email: item.email ?? "Not Available",
            action: <div className='flex flex-row'>
              <p className="btn bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => editAction(item)}>Edit</p>
              <p className="btn bg-red-500 text-white px-4 py-2 rounded-lg ml-4 cursor-pointer" onClick={() => deleteAction(item)}>Delete</p>
            </div>,
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

  const editAction = async (user_details: any) => {
    setModalData(user_details)
    setIsModalOpen(true);
  }

  const deleteAction = async (user_details: any) => {
    setLoader(true)
    await fetch(process.env.REACT_APP_BASE_URL + "admin/user/" + user_details.id, {
      method: "DELETE",
      headers: {
        "Authorization": localStorage.getItem("auth_token") ?? ""
      }
    }).then(res => res.json()).then((response) => {
      if (response.success) {
        toast.success(response.message, {
          position: "bottom-center",
          autoClose: 3000
        })
      } else {
        toast.error(response.message, {
          position: "bottom-center",
          autoClose: 3000
        })
      }
    }).finally(() => setLoader(false))
  }

  const addUser = () => {
    setIsModalOpen(true);
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
          <p onClick={addUser} className='bg-green-500 text-white text-[16px] font-500 px-4 py-2 rounded-[20px] h-fit cursor-pointer'>Add User</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <Table dataSource={rowData} columns={columns} pagination={false} loading={loader} />
        <ToastContainer />
      </div>
      <AddUser isModalOpen={isModalOpen} modalData={modalData} closeModal={closeModal} getUsersData={getUsersData} />
    </React.Fragment>
  );
};

export default ManageUser;
