import { Link } from "react-router-dom";
import './MainHeader.css';

const imagesPrefixURL: string = "../../static/assets/";

export default function MainHeader(){
  return(
    <header id="manager-header">
      <nav>
        <ul>
          <li>
            <Link to={"/manager"}>
              <img className="logo" src={`${imagesPrefixURL}/mmlogo.webp`} alt="MoneyMind" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}