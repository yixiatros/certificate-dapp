import React from 'react'
import { FaHome } from 'react-icons/fa'
import { Link } from 'react-router'

type Props = {}

const IssuerSidebar = (props: Props) => {
  return (
        <nav className="block py-4 px-6 top-0 bottom-0 w-64 bg-background border-x border-primary shadow-xl left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full">
        
        <button className="md:hidden flex items-center justify-center cursor-pointer text-text-700 w-6 h-10 border-l-0 border-r border-t border-b border-solid border-primary-100 text-xl leading-none bg-primary rounded-r border border-solid border-transparent absolute top-1/2 -right-6 focus:outline-none z-9998">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      
        <div className="flex-col min-h-full px-0 flex flex-wrap items-center justify-between w-full mx-auto overflow-y-auto overflow-x-hidden">
          <div className="flex bg-background flex-col items-stretch opacity-100 relative mt-4 overflow-y-auto overflow-x-hidden h-auto z-40 items-center flex-1 rounded w-full">
            <div className="md:flex-col md:min-w-full flex flex-col list-none">
              <Link to="Profile" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
                <FaHome />
                <h6 className='ml-3'>Profile</h6>
              </Link>
              <Link to="Issue Certificate" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
                <h6 className='ml-3'>Issue Certificate</h6>
              </Link>
            </div>
          </div>
        </div>
      
    </nav>
  )
}

export default IssuerSidebar