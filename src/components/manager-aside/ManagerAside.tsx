import { Link } from "react-router-dom";
import './manager-aside.css';

export default function ManagerSideMenu(){
  return(
    <nav id="manager-side-menu">
      <ul id="manager-side-menu-table-section">
        Budget Tables
        <li>
          <Link to={"/manager/table"}>Monthly Table</Link>
        </li>
      </ul>
    </nav>
  )
}