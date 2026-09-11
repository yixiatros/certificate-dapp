import { createBrowserRouter } from "react-router";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import SigninPage from "../Pages/SignInPage/SignInPage";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard"
import { ProtectedRoute } from "../Components/ProtectedRoute/ProtectedRoute";
import { UserRole } from "../Types/Auth";

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
                    <AdminDashboard />
                </ProtectedRoute>
            )},
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