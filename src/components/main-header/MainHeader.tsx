import { Link } from "react-router-dom";
import './MainHeader.css';
import logo from '../../assets/mmlogo.webp';

export default function MainHeader(){
  return(
    <header id="manager-header">
      <nav>
        <ul>
          <li>
            <Link to={"/manager"}>
              <img className="logo" src={logo} alt="MoneyMind" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}