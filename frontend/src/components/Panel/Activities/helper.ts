import React from "react";

export interface DataType {
  key: string;
  result: React.ReactElement;
  url: string;
  created_at: string;
}

export const columns = [
  {
    title: 'S.No',
    dataIndex: 'key',
    key: 'key'
  },
  {
    title: 'Urls',
    dataIndex: 'url',
    key: 'url'
  },
  {
    title: 'Result',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: 'Performed on',
    dataIndex: 'created_at',
    key: 'created_at'
  }
];