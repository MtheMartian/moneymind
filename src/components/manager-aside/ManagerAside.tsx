import { Link } from "react-router-dom";
import './manager-aside.css';
import '../../pages/manager/manager.css';

const iconsPrefixURL: string = "../../../../static/assets/manager-icons/";

export default function ManagerSideMenu(props: {forceRerender: Function}){
  return(
    <nav id="manager-side-menu">
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={`${iconsPrefixURL}/table-48px.svg`} alt="table" />
          <h3>Money Manager</h3>
        </div>
        <li>
          <Link to={"/manager"} onClick={()=> props.forceRerender(null, "manager")}>Monthly Table</Link> 
        </li>
        <li>
          <Link to={"/manager/daily"} onClick={()=> props.forceRerender(null, "daily")}>Daily Table</Link>
        </li>
      </ul>
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={`${iconsPrefixURL}/calculate-48px.svg`} alt="calculator" />
          <h3>Calendar</h3>
        </div>
        <li>
          <Link to={"/manager/calendar"} onClick={()=> props.forceRerender(null, "calendar")}>Calendar</Link>  
        </li>
      </ul>
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={`${iconsPrefixURL}/calculate-48px.svg`} alt="calculator" />
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