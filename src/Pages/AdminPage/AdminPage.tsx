import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../../Components/AdminSidebar/AdminSidebar";
import Title from "../../Components/Title/Title";
import Dashboard from "../../Components/Dashboard/Dashboard";

interface Props { }

const AdminPage = (props: Props) => {
  return (
    <div className="relative text-left flex h-full w-full overflow-hidden">
      <Sidebar />

      <Dashboard>
        <Title title="Users" subtitle="100" />
        <Title title="Active Certificates" subtitle="10" />
        <Title title="Revoked Certificates" subtitle="5" />
      </Dashboard>

    </div>
  )
}

export default AdminPage