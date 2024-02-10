import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import MoneyManager from "./pages/manager/MoneyManager";
import Header from "./components/navbar/Header";
import MainHeader from "./components/main-header/MainHeader";
import ManagerSideMenu from "./components/manager-aside/ManagerAside";
import Footer from "./components/footer/Footer";
import DailyTable from "./pages/manager/daily-table/DailyTable";
import MonthlyTable from "./pages/manager/monthly-table/MonthlyTable";
import Calendar from "./pages/manager/calendar/Calendar";
import {useState, useEffect, useRef} from 'react';

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
    <ManagerSideMenu setRedirected={props.setRedirected} />
    <main id="money-manager">
      <Outlet />
    </main>
    <Footer />
    </>
  )
}

function App(){
  const [redirected, setRedirected] = useState<boolean | null>(null);

  // Indices -> 1: Monthly Table, 2: Daily Table, 3: Calendar
  const pagesToRerender = useRef<boolean[]>(new Array(3).fill(false));

  function forceRerender(event: PopStateEvent): void{
    const currentDocument: Window = event.currentTarget as Window;
    const oldURL: string = new URL(window.location.href).pathname
    const newURL: string = new URL(currentDocument.location.href).pathname;
    
    if(newURL.length > 8){
      
    }
  }

  useEffect(()=>{
    window.addEventListener("popstate", forceRerender);

    return()=>{
      window.removeEventListener("popstate", forceRerender);
      setRedirected(prev => prev = null);
    }
  },[])

  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
  },
  {
    path: "/manager",
    element: <ManagerLayout setRedirected={setRedirected}/>,
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