import { Routes, Route, Navigate } from "react-router-dom";
import HomePage  from "./pages"
import UserToAppPayments from "./pages/UserToApp";
import AppToUserPayments from "./pages/AppToUser";
import AuthProvider from "./components/Auth";



export default function Shop() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage/>}/> 
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/payments/usertoapp" element={<UserToAppPayments />} key="UserToApp" />
          <Route path="/payments/apptouser" element={<AppToUserPayments />} key="AppToUser" />
        </Routes>
      </AuthProvider>
    </>
  );
}
