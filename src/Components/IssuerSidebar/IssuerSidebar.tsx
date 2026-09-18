import React from 'react'
import { FaHome, FaAddressCard, FaCertificate } from 'react-icons/fa'
import { Link } from 'react-router'
import Sidebar from '../Sidebar/Sidebar'

type Props = {}

const IssuerSidebar = (props: Props) => {
  return (
    <Sidebar>
      <Link to="Profile" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
        <FaHome />
        <h6 className='ml-3'>Profile</h6>
      </Link>

      <Link to="Issuer Certificates" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
        <FaCertificate />
        <h6 className='ml-3'>Issued Certificates</h6>
      </Link>

      <Link to="Issue Certificate" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
        <FaAddressCard />
        <h6 className='ml-3'>Issue Certificate</h6>
      </Link>
    </Sidebar>
  )
}

export default IssuerSidebar