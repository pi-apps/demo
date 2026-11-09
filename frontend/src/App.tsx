import { RouterProvider } from "react-router-dom";
import router from "./Router.tsx";
import AuthProvider from "./components/AuthProvider.tsx";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
