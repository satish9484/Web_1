import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { UserColumns, UserDataType } from './Helper';
import { SearchIcon } from '../../../Assets/Icons/Icon';
import Icon from "../../../Assets/Images/logo.png"



const UserRecords = ({ data }: { data: { [key: string]: string | number }[] }) => {
    const [rowData, setRowData] = useState<UserDataType[]>([]);
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        getUsersData()
    }, [])

    const getUsersData = async (email: string = "") => {
        if (data && data.length) {
            let temp: UserDataType[] = []
            data.map((item: any, index: number) => {
                temp.push({
                    key: (index + 1).toString(),
                    name: item.full_name ?? "Not Available",
                    url: item.url ?? "Not Available",
                    result: item.result === "Not Safe" ?
                        <p className='bg-red-600 text-white px-8 py-2 w-fit rounded-[20px]'>Not Safe</p> :
                        <p className='bg-green-600 text-white px-6 py-2 w-fit rounded-[20px]'>Safe</p>,
                })
            })
            setRowData(temp)
        }
    }

    return (
        <React.Fragment>
            {/* <div className="bg-white p-6 rounded-lg shadow-md"> */}
            <Table dataSource={rowData} columns={UserColumns} pagination={false} loading={loader} scroll={{ x: true }} />
            <ToastContainer />
            {/* </div> */}
        </React.Fragment>
    );
};

export default UserRecords;
