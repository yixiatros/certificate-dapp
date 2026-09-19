import type { JSX, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';
import { UserRole } from '../../Types/Auth';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, requireAdmin }: ProtectedRouteProps): JSX.Element {
    const { isAuthenticated, profile, isConnecting } = useAuth();

    if (isConnecting) {
        return <div className="p-8 text-center text-text-secondary">Verifying wallet session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/SignIn" replace />;
    }

    if (requireAdmin && !profile?.isAdmin) {
        return (
            <div className="p-8 text-center text-red-400">
                <h2>Access Denied</h2>
                <p>Only the contract administrator can access this page.</p>
            </div>
        );
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = profile?.role ?? UserRole.Unregistered;
        if (!allowedRoles.includes(userRole) && !profile?.isAdmin) {
            return (
                <div className="p-8 text-center text-red-400">
                    <h2>Access Denied</h2>
                    <p>You do not have the required role to view this page.</p>
                </div>
            );
        }
    }

    return <>{children}</>;
}
