import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import Header from "./components/navbar/Header";
import MainHeader from "./components/main-header/MainHeader";
import ManagerSideMenu from "./components/manager-aside/ManagerAside";
import Footer from "./components/footer/Footer";
import DailyTable from "./pages/manager/daily-table/DailyTable";
import MonthlyTable from "./pages/manager/monthly-table/MonthlyTable";
import Calendar from "./pages/manager/calendar/Calendar";
import {useEffect} from 'react';
import {store, updateMonthlyState, updateDailyState, updateCalendarState} from './redux/store';
import { Provider } from "react-redux";
import SignIn from "./pages/user/signin/SignIn";
import SignUp from "./pages/user/signup/SignUp";
import Calculators from "./pages/calculators/Calculators.tsx";

function Layout(){
  return(
    <>
      <Header />
      <Outlet />
    </>
    
  )
}

function ManagerLayout(props: {forceRerender: Function}){
  return(
    <>
    <MainHeader />
    <ManagerSideMenu forceRerender={props.forceRerender} />
    <main id="money-manager">
      <Provider store={store}>
        <Outlet />
      </Provider>
    </main>
    <Footer />
    </>
  )
}

function App(){
  function forceRerender(event: PopStateEvent | null, componentStr?: string): void{

    let lastPathNameIdx: number = 0;
    let tempStr: string = "";

    if(event && (!componentStr || componentStr === undefined)){
      const currentDocument: Window = event.currentTarget as Window;
      const historyURL: string = new URL(currentDocument.location.href).pathname;
      
      for(let i: number = historyURL.length - 1; i >= 0; i--){
        if(historyURL[i] === "/"){
          lastPathNameIdx = i + 1;
          break;
        }
      }

      tempStr = historyURL.substring(lastPathNameIdx);
    }
    else if(componentStr || componentStr !== undefined){
      tempStr = componentStr;
    }

    switch(tempStr){
      case "manager":
        store.dispatch(updateMonthlyState());
        return;

      case "daily":
        store.dispatch(updateDailyState());
        return;

      case "calendar":
        store.dispatch(updateCalendarState());
        return;
    }
  }

  useEffect(()=>{
    window.addEventListener("popstate", forceRerender);

    return()=>{
      window.removeEventListener("popstate", forceRerender);
    }
  },[]);

  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/manager",
    element: <ManagerLayout forceRerender={forceRerender} />,
    children: [{
      path: "/manager",
      element: <MonthlyTable />
    },
    {
      path: "/manager/daily",
      element: <DailyTable />
    },
    {
      path: "/manager/calendar",
      element: <Calendar />
    },
    {
      path: "/manager/calculators",
      element: <Calculators />
    }
  ]
  }
]);

  return(
    <RouterProvider router={router} />
  )
}

export default App