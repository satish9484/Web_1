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

export interface UserDataType {
  key: string;
  name: string;
  url: string;
  result: React.ReactElement;
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

export const UserColumns = [
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
  },
  {
    title: 'Result',
    dataIndex: 'result',
    key: 'result',
  }
];

export const CommentColumns = [
  {
    title: 'S.No',
    dataIndex: 'key',
    key: 'key'
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
  },
  // {
  //   title: 'Faq Id',
  //   dataIndex: 'faq_id',
  //   key: 'faq_id',
  // },
  {
    title: 'User Email',
    dataIndex: 'email',
    key: 'email',
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