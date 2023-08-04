import AppToUserPayments from "./pages/AppToUser";
import UserToAppPayments from "./pages/UserToApp";



const routes = [    
    {
      name: "Payments",
      collapse: [
        {
          key: "UserToApp",
          name: "User to App Payments",
          route: "/payments/usertoapp",
          component: <UserToAppPayments />,
        },
        {
          key: "AppToUser",
          name: "App to User Payments",
          route: "/payments/apptouser",
          component: <AppToUserPayments />,
        },
      ],
    },
  ];
  
export default routes;