import { createBrowserRouter } from "react-router";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import SigninPage from "../Pages/SignInPage/SignInPage";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import { ProtectedRoute } from "../Components/ProtectedRoute/ProtectedRoute";
import { UserRole } from "../Types/Auth";
import AdminPage from "../Pages/AdminPage/AdminPage";
import AdminRegisterUser from "../Components/AdminRegisterUser/AdminRegisterUser";
import AdminProfile from "../Components/AdminProfile/AdminProfile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "SignIn", element: <SigninPage /> },
            { path: "Privacy Policy", element: <PrivacyPolicy /> },
            { path: "Admin Dashboard", element: (
                <ProtectedRoute requireAdmin>
                    <AdminPage />
                </ProtectedRoute>
              ), children: [
                {path: "Admin Profile", element: <AdminProfile /> },
                { path: "Register User", element: (
                    <ProtectedRoute requireAdmin>
                        <AdminRegisterUser />
                    </ProtectedRoute>
                )}
              ]
            },
            { path: "Issue Certificate", element: (
                <ProtectedRoute allowedRoles={[UserRole.Issuer]}>
                    <div>Issuer Page: Issue New Certificate</div>
                </ProtectedRoute>
            )},
            { path: "Revoke Certificate", element: (
                <ProtectedRoute allowedRoles={[UserRole.RevocationOfficer]}>
                    <div>Revocation Officer Page</div>
                </ProtectedRoute>
            )}
        ]
    }
])