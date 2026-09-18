import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import { Link } from 'react-router'
import { FaCertificate, FaHome, FaUser } from 'react-icons/fa'

type Props = {}

const AuditorSidebar = (props: Props) => {
  return (
    <Sidebar>
        <Link to="Profile" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
          <FaHome />
          <h6 className='ml-3'>Profile</h6>
        </Link>

        <Link to="Users" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
            <FaUser />
            <h6 className='ml-3'>Users</h6>
        </Link>

        <Link to="Certificates" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
            <FaCertificate />
            <h6 className='ml-3'>Certificates</h6>
        </Link>
    </Sidebar>
  )
}

export default AuditorSidebar