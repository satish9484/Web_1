import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { DataType, columns } from './helper';
import { SearchIcon } from '../../../Assets/Icons/Icon';
import Icon from "../../../Assets/Images/logo.png"



const Activity: React.FC = () => {
    const [rowData, setRowData] = useState<DataType[]>([]);
    const [loader, setLoader] = useState<boolean>(true)
    // const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        getUsersData()
    }, [])

    const getUsersData = async (email: string = "") => {
        setLoader(true)
        await fetch(process.env.REACT_APP_BASE_URL + "admin/users/activity", {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("auth_token") ?? ""
            }
        }).then(res => res.json()).then((response) => {
            if (response.success) {
                let temp: DataType[] = []
                response.data.map((item: any, index: number) => {
                    temp.push({
                        key: (index + 1).toString(),
                        url: item.url ?? "Not Available",
                        result: item.result === "Not Safe" ?
                            <p className='bg-red-600 text-white px-8 py-2 w-fit rounded-[20px]'>Not Safe</p> :
                            <p className='bg-green-600 text-white px-6 py-2 w-fit rounded-[20px]'>Safe</p>,
                        created_at: item.created_at ?? "Not Available",
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

    return (
        <React.Fragment>
            <div className='w-full h-full overflow-y-auto hide-scrollbar'>
                <div className='w-full flex flex-row justify-between flex-wrap mt-4 mb-6'>
                    <div>
                        <h2 className='text-[32px] font-[700]'>Users Activity</h2>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">User List</h2>
                    <Table dataSource={rowData} columns={columns} pagination={false} loading={loader} />
                    <ToastContainer />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Activity;
