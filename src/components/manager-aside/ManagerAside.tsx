import { Link } from "react-router-dom";
import './manager-aside.css';
import '../../pages/manager/manager.css';
import table from '../../assets/manager-icons/table-48px.svg';
import calculator from '../../assets/manager-icons/calculate-48px.svg';
import { currentURLSearchParams } from "../../pages/manager/manager";
import {useEffect} from 'react';

export default function ManagerSideMenu(props: {setRedirected: Function}){
  function forceRerender(page: number): void{
    const newSearchParams: URLSearchParams = new URL(window.location.href).searchParams;

    console.log(`Search Params: ${newSearchParams.size}`);

    props.setRedirected(page);

  }

  return(
    <nav id="manager-side-menu">
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={table} alt="table" />
          <h3>Money Manager</h3>
        </div>
        <li>
          <Link to={"/manager"} onClick={()=> forceRerender(1)}>Monthly Table</Link> 
        </li>
        <li>
          <Link to={"/manager/daily"} onClick={()=> forceRerender(2)}>Daily Table</Link>
        </li>
      </ul>
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={calculator} alt="calculator" />
          <h3>Calendar</h3>
        </div>
        <li>
          <Link to={"/manager/calendar"} onClick={()=> forceRerender(2)}>Calendar</Link>  
        </li>
      </ul>
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={calculator} alt="calculator" />
          <h3>Calculators</h3>
        </div>
        <li>
          <Link to={"/manager"}>Mortgage</Link>  
        </li>
        <li>
          <Link to={"/manager"}>Car Loan</Link>
        </li>
      </ul>
    </nav>
  )
}