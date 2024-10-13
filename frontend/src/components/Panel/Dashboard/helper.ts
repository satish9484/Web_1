import React from "react";

export const formatDate = () => {
    const today = new Date();
  
    // Options for getting the formatted day, month, and year
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
  
    // Get date string
    let formattedDate = today.toLocaleDateString('en-US', options);
  
    // Replace the short month abbreviation with a custom format (adding the period)
    formattedDate = formattedDate.replace('.', '');  // Remove the period after the month (if exists)
    const monthAbbr = formattedDate.split(' ')[2];
    formattedDate = formattedDate.replace(monthAbbr, monthAbbr + '');
  
    return formattedDate;
  }


export interface DataType {
  key: string;
  name: string;
  url: string;
  // ipv4: string;
  action : React.ReactElement,
  email: string;
}

export const columns = [
  // {
  //   title: 'Image',
  //   dataIndex: 'image',
  //   key: 'image',
  //   render: () => <Avatar src="https://i.pravatar.cc/40" />,
  // },
  {
    title: 'S.No',
    dataIndex: 'key',
    key: 'key'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Urls',
    dataIndex: 'url',
    key: 'url',
    // render: (text: string) => <a href={text}>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'action',
    // render: () => <Button type="primary">View</Button>,
  },
];