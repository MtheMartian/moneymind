import { Link } from "react-router-dom";
import './MainHeader.css';

export default function MainHeader(){
  return(
    <header id="manager-header">
      <nav>
        <ul>
          <li>
            <Link to={"/manager"}>Manager</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}