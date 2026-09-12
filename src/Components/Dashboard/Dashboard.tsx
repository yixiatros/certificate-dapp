import { Outlet } from "react-router"
import { useAuth } from "../../Context/AuthContext";
import { UserRole } from "../../Types/Auth";

type Props = {
  children: React.ReactNode;
}

const AdminDashboard = ({ children }: Props) => {
  const { profile } = useAuth();

  return (
    <div className="relative md:ml-64 bg-text-100 w-full">
        <div className="relative pt-20 pb-32 bg-text-secondary-500">
          <div className="px-4 md:px-6 mx-auto w-full">
            <div className="divide-y divide-primary">
              { profile?.role === UserRole.Admin && (
                <div className="justify-center flex flex-wrap">
                  {children}
                </div>
              )}
              <div className="mt-6 flex flex-wrap">
                {<Outlet />}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminDashboard