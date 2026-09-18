import { FaHome, FaUser, FaUserPlus } from 'react-icons/fa'
import { Link } from 'react-router'
import Sidebar from '../Sidebar/Sidebar'

interface Props { }

const AdminSidebar = (props: Props) => {
  return (
    <Sidebar>
      <Link to="Admin Profile" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
        <FaHome />
        <h6 className='ml-3'>Admin Profile</h6>
      </Link>
      
      <Link to="Register User" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
        <FaUserPlus />
        <h6 className='ml-3'>Register User</h6>
      </Link>
      
      <Link to="Users" className="md:min-w-full text-text-secondary-500 text-medium uppercase font-bold flex items-center pt-1 pb-4 no-underline">
        <FaUser />
        <h6 className='ml-3'>Users</h6>
      </Link>
    </Sidebar>
  )
}

export default AdminSidebar