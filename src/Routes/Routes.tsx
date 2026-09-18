import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import SigninPage from "../Pages/SignInPage/SignInPage";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import { ProtectedRoute } from "../Components/ProtectedRoute/ProtectedRoute";
import { UserRole } from "../Types/Auth";
import AdminPage from "../Pages/AdminPage/AdminPage";
import AdminRegisterUser from "../Components/AdminRegisterUser/AdminRegisterUser";
import AdminProfile from "../Components/AdminProfile/AdminProfile";
import IssueCertificate from "../Components/IssueCertificate/IssueCertificate";
import IssuerCertificates from "../Components/IssuerCertificates/IssuerCertificates";
import IssuerPage from "../Pages/IssuerPage/IssuerPage";
import HolderPage from "../Pages/HolderPage/HolderPage";
import RevokeCertificate from "../Components/RevokeCertificate/RevokeCertificate";
import Users from "../Components/Users/Users";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "SignIn", element: <SigninPage /> },
            { path: "Privacy Policy", element: <PrivacyPolicy /> },
            {
                path: "My Certificates",
                element: (
                    <ProtectedRoute allowedRoles={[UserRole.Holder]}>
                        <HolderPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "Admin Dashboard", element: (
                    <ProtectedRoute requireAdmin>
                        <AdminPage />
                    </ProtectedRoute>
                ), children: [
                    { index: true, element: <Navigate to="Admin Profile" replace /> },
                    { path: "Admin Profile", element: <AdminProfile /> },
                    { path: "Register User", element: <AdminRegisterUser /> },
                    { path: "Users", element: <Users /> }
                ]
            },
            {
                path: "Issuer Dashboard", element: (
                    <ProtectedRoute allowedRoles={[UserRole.Issuer]}>
                        <IssuerPage />
                    </ProtectedRoute>
                ), children: [
                    { index: true, element: <Navigate to="Profile" replace /> },
                    { path: "Profile", element: <AdminProfile /> },
                    { path: "Issuer Certificates", element: <IssuerCertificates /> },
                    { path: "Issue Certificate", element: <IssueCertificate /> }
                ]
            },
            {
                path: "Revoke Certificate", element: (
                    <ProtectedRoute allowedRoles={[UserRole.RevocationOfficer]}>
                        <RevokeCertificate />
                    </ProtectedRoute>
                )
            }
        ]
    }
])