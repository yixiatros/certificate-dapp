import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../../Components/AdminSidebar/AdminSidebar";
import Title from "../../Components/Title/Title";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { getAllUsers, getAllCertificates } from "../../Utils/Contract";
import { useEffect, useState } from 'react';

interface Props { }

const AdminPage = (props: Props) => {

    const [userCount, setUserCount] = useState<number>(0);
    const [certCount, setCertCount] = useState<number>(0);

    useEffect(() => {
        // Fetch data asynchronously when the component loads
        const fetchData = async () => {
            const users = await getAllUsers();
            const certs = await getAllCertificates();

            setUserCount(users.length);
            setCertCount(certs.length);
        };

        fetchData();
    }, []);




  return (
    <div className="relative text-left flex h-full w-full overflow-hidden">
      <Sidebar />

      <Dashboard>
              <Title title="Users" subtitle={userCount.toString()} />
              <Title title="Active Certificates" subtitle={certCount.toString()}/>
        <Title title="Revoked Certificates" subtitle="5" />
      </Dashboard>

    </div>
  )
}

export default AdminPage