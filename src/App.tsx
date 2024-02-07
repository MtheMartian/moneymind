import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import MoneyManager from "./pages/manager/MoneyManager";
import Header from "./components/navbar/Header";
import MainHeader from "./components/main-header/MainHeader";
import ManagerSideMenu from "./components/manager-aside/ManagerAside";
import Footer from "./components/footer/Footer";
import DailyTable from "./pages/manager/daily-table/DailyTable";
import MonthlyTable from "./pages/manager/monthly-table/MonthlyTable";
import Calendar from "./pages/manager/calendar/Calendar";
import {useState, useEffect} from 'react';

function Layout(){
  return(
    <>
      <Header />
      <Outlet />
    </>
    
  )
}

function ManagerLayout(props: {setRedirected: Function}){
  return(
    <>
    <MainHeader />
    <ManagerSideMenu setRedirected={props.setRedirected}/>
    <main id="money-manager">
      <Outlet />
    </main>
    <Footer />
    </>
  )
}

function App(){
  const [redirected, setRedirected] = useState<boolean>(false);

  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
  },
  {
    path: "/manager",
    element: <ManagerLayout setRedirected={setRedirected} />,
    children: [{
      path: "/manager",
      element: <MonthlyTable redirected={redirected} />
    },
    {
      path: "/manager/daily",
      element: <DailyTable />
    },
    {
      path: "/manager/calendar",
      element: <Calendar />
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