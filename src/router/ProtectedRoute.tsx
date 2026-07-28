import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../comp/AuthProvider";

const ProtectedRoute = () => {

    const { member, loading } = useAuth();

    console.log("ProtectedRoute 실행", member, loading);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!member) {
        return <Navigate to="/user/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
