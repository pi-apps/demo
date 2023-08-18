import AppToUserPayments from "./pages/AppToUser";
import UserToAppPayments from "./pages/UserToApp";

/* 
 * to create a routes array that can be dynamically iterated on use this
 * template. The method to map this array into routes jsx components will 
 * need written and added to the index.tsx that is in this directory.
 * 
 * for simplicity we did not implement this method
 */

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