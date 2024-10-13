import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardIcon, FaqIcon, GraphIcon, LogoutIcon, SettingsIcon, UrlDetectorIcon } from '../../Assets/Icons/Icon';

const Sidebar = ({ role }: { role: string }) => {
  return (
    <div className="min-w-[200px] md:w-[200px] bg-white shadow-lg h-full flex flex-col items-center py-4 overflow-hidden transition-all duration-300 ease-in-out">
      {role === "admin" && <Link to="/panel/dashboard" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <DashboardIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">Dashboard</span>
      </Link>}

      <Link to="/panel/url-detector" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <UrlDetectorIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">Url Detector</span>
      </Link>

      {role === "admin" && <Link to="/panel/graph" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <GraphIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">Graph</span>
      </Link>}

      {role === "admin" && <Link to="/panel/manage-users" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <SettingsIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">Manage Users</span>
      </Link>}

      <Link to="/panel/faq" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <FaqIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">FAQ</span>
      </Link>

      <Link to="/panel/queries" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <FaqIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">Queries</span>
      </Link>

      <Link to="/login" className='my-4 w-full flex items-center justify-start md:pl-4'>
        <LogoutIcon />
        <span className="hidden md:inline-block ml-4 text-gray-900">Logout</span>
      </Link>

    </div>)

};

export default Sidebar;
