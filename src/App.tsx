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
import {store, updateMonthlyState, updateDailyState, updateCalendarState} from './redux/store';
import { Provider } from "react-redux";

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
      <Provider store={store}>
        <Outlet />
      </Provider>
    </main>
    <Footer />
    </>
  )
}

function App(){
  const [redirected, setRedirected] = useState<number | null>(null);

  // Indices -> 0: Monthly Table, 1: Daily Table, 2: Calendar
  // const pagesToRerender = useRef<boolean[]>(new Array(3).fill(false));

  // function forceRerenderHelper(idx: number): void{
  //   for(let i: number = 0; i < pagesToRerender.current.length; i++){
  //     if(i === idx){
  //       pagesToRerender.current[i] = true;
  //       continue;
  //     }

  //     pagesToRerender.current[i] = false;
  //   }
  // }

  function forceRerender(event?: PopStateEvent, componentStr?: string): void{

    let lastPathNameIdx: number = 0;
    let tempStr: string = "";

    if(event !== undefined || event && (!componentStr || componentStr === undefined)){
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
      setRedirected(prev => prev = null);
    }
  },[]);

  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
  },
  {
    path: "/manager",
    element: <ManagerLayout setRedirected={forceRerender} />,
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