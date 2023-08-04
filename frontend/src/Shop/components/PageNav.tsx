import { Link } from "react-router-dom";

export default function PageNavigation() {
    return (
      <>
            <Link to="/">HOME</Link> 
            <Link to="/payments/usertoapp">User to App</Link>
            <Link to="/payments/apptouser">App to User</Link>
      </>
    );
  }