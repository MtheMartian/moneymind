import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import MoneyManager from "./pages/manager/MoneyManager";
import Header from "./components/navbar/Header";
import MainHeader from "./components/main-header/MainHeader";
import ManagerSideMenu from "./components/manager-aside/ManagerAside";
import Footer from "./components/footer/Footer";
import DailyTable from "./pages/manager/daily-table/DailyTable";
import MonthlyTable from "./pages/manager/monthly-table/MonthlyTable";

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
    <MainHeader />
    <ManagerSideMenu />
    <main id="money-manager">
      <Outlet />
    </main>
    <Footer />
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
      path: "/manager",
      element: <MonthlyTable />
    },
    {
      path: "/manager/daily",
      element: <DailyTable />
    }
  ]
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