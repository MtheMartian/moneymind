import { RouterProvider, Outlet, Router, createBrowserRouter } from "react-router-dom";
import MoneyManager from "./pages/MoneyManager";
import Header from "./components/navbar/Header";

function Layout(){
  return(
    <>
      <Header />
      <Outlet />
    </>
    
  )
}

function ManagerLayout(){
  return(
    <>
    <Header />
    <Outlet />
    </>
  )
}

function App(){
  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
  },
  {
    path: "/manager",
    element: <ManagerLayout />,
    children: [{
      path: "/table",
      element: <MoneyManager />
    }]
  },
  {
    path: "/login",
    element: <MoneyManager />
  }
]);

  return(
    <RouterProvider router={router} />
  )
}

export default App