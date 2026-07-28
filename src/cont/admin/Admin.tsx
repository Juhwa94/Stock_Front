import React from "react";
import { useAuth } from "../../comp/AuthProvider";

const Admin: React.FC = () => {

  const { member } = useAuth();

  console.log("Admin 회원정보:", member);
  console.log("Admin 권한:", member?.authority);

  return (
    <h1>
      관리자 메인페이지
    </h1>
  );
};

export default Admin;