import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ReportDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([])

  useEffect(() => {
    let validate = validator();
    if (validate.success) {
      getDetailReport()
    } else {
      toast.error(validate.message, {
        position: "bottom-center",
        autoClose: 3000
      })
    }
  }, [])

  const getDetailReport = async () => {
    setLoading(true)
    await fetch(process.env.REACT_APP_BASE_URL + "ml/feature-detail", {
      method: "POST",
      headers: {
        "Authorization": localStorage.getItem("auth_token") ?? "",
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ url: location.state.url })
    }).then(res => res.json()).then((response) => {
      if (response.success) {
        if (response.detail && response.detail.length) {
          let temp: any = [];
          // Object.keys(response.detail[0]).map((item) => {
          //   if (typeof response.detail[0][item] === "string") {
          //     temp.push({ key: item, value: response.detail[0][item] })
          //   }
          // })
          temp = flattenObject(response.detail[0]);
          // setData(response.detail[0])
          setData(temp)
        } else {
          toast.error("Data Not Available", {
            position: "bottom-center",
            autoClose: 3000
          })
        }
      } else {
        toast.error(response.message, {
          position: "bottom-center",
          autoClose: 3000
        })
      }
    }).finally(() => { setLoading(false) })
  }

  const validator = () => {
    if (location && location.state && location.state.url && location.state.url.trim().length) {
      return { "success": true, "message": "All Okay" }
    } else {
      return { "success": false, "message": "Url is Missing" }
    }
  }

  const flattenObject = (obj: any, parentKey = '', result: any = []) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}_${key}` : key; // Concatenate parent key with current key using an underscore

        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          // Recursively flatten the nested object
          flattenObject(obj[key], newKey, result);
        } else {
          // Assign the value to the result object
          if (obj[key] !== "") {
            result.push({ "key": newKey, "value": obj[key] ?? "NA" })
          }
        }
      }
    }
    return result;
  }

  const testAnotherResult = () => {
    navigate("/panel/url-detector")
  }

  return (
    <React.Fragment>
      {loading ? <div className='flex flex-col justify-center'>
        <h2 className='text-[44px] text-center mt-6'>Loading ...</h2>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div> : <div className='w-full h-full overflow-y-auto hide-scrollbar'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col'>
            <h2 className='text-[32px] font-[700]'>Url Detailed Report</h2>
            <p className='text-[24px] bg-lime-300 w-fit rounded-[30px] px-[20px] my-4'>{location.state.url}</p>
          </div>
          <p className='text-white bg-blue-600 px-4 py-2 font-[500] text-[14px] rounded-[20px] h-fit cursor-pointer' onClick={testAnotherResult}>
            Check Another Url
          </p>
        </div>


        <hr className='my-4 h-[2px] border-none bg-[#0575E6]' />
        <PremiumTable data={data} />
      </div>}
      <ToastContainer />
    </React.Fragment>
  )
}

interface DataRow {
  key: string;
  value: string;
}

interface PremiumTableProps {
  data: DataRow[];
}

const PremiumTable: React.FC<PremiumTableProps> = ({ data }) => {
  return (
    <div className="flex justify-center items-center bg-gray-100 mt-[100px]">
      <div className="w-full min-w-[70%] max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full min-w-[70%] table-auto">
          <thead>
            <tr className="bg-[#0575E6] text-white">
              <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Property</th>
              <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="py-3 px-4 text-gray-700 font-medium">{row.key}</td>
                <td className="py-3 px-4 text-gray-600">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportDetails