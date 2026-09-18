import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import Title from "../../Components/Title/Title";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { getAllUsers, getAllCertificates } from "../../Utils/Contract";
import { useEffect, useState } from 'react';
import { Link } from "react-router/internal/react-server-client";

interface Props { }

const AdminPage = (props: Props) => {

  const [userCount, setUserCount] = useState<number>(0);
  const [activeCertCount, setActiveCertCount] = useState<number>(0);
  const [revokedCertCount, setRevokedCertCount] = useState<number>(0);

  useEffect(() => {
    // Fetch data asynchronously when the component loads
    const fetchData = async () => {
      const users = await getAllUsers();
      const activeCerts = (await getAllCertificates()).filter(cert => cert.status === "Valid");
      const revokedCerts = (await getAllCertificates()).filter(cert => cert.status === "Revoked");

      setUserCount(users.length);
      setActiveCertCount(activeCerts.length);
      setRevokedCertCount(revokedCerts.length);
    };

    fetchData();
  }, []);




  return (
    <div className="relative text-left flex h-full w-full overflow-hidden">
      <AdminSidebar />

      <Dashboard>
        <Link to="Users" className="flex-1 mr-4">
          <Title title="Users" subtitle={userCount.toString()} />
        </Link>

        <Link to="Certificates" className="flex-1 mr-4">
          <Title
            title="Active Certificates"
            subtitle={activeCertCount.toString()}
          />
        </Link>

        <Link to="Certificates" className="flex-1 mr-4">
          <Title
            title="Revoked Certificates"
            subtitle={revokedCertCount.toString()}
          />
        </Link>
      </Dashboard>
    </div>
  )
}

export default AdminPage