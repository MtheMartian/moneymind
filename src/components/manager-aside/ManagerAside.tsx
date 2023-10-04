import { Link } from "react-router-dom";
import './manager-aside.css';
import '../../pages/manager/manager.css';
import table from '../../assets/manager-icons/table-48px.svg';
import calculator from '../../assets/manager-icons/calculate-48px.svg';

export default function ManagerSideMenu(){
  return(
    <nav id="manager-side-menu">
      <ul className="manager-side-menu-sections">
        <div className="manager-side-menu-header">
          <img className="manager-icons" src={table} alt="table" />
          <h3>Money Manager</h3>
        </div>
        <li>
          <Link to={"/manager"}>Monthly Table</Link> 
        </li>
        <li>
          <Link to={"/manager/daily"}>Daily Table</Link>
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