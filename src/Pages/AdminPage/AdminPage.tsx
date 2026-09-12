import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminDashboard from "../../Components/AdminDashboard/AdminDashboard";
import Title from "../../Components/Title/Title";

interface Props { }

const AdminPage = (props: Props) => {
  return (
    <div className="relative text-left flex h-screen w-full overflow-hidden">

      <Sidebar />

      <AdminDashboard>
        <Title title="Users" subtitle="100" />
        <Title title="Active Certificates" subtitle="10" />
        <Title title="Revoked Certificates" subtitle="5" />
      </AdminDashboard>

    </div>
  )
}

export default AdminPage