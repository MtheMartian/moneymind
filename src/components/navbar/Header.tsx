import {Link} from 'react-router-dom';

export default function Header(){
  return(
    <header>
      <nav>
        <ul>
          <li>
            <Link to={"/"}>MoneyMind</Link>
          </li>
          <li>
            <Link to={"/manager"}>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}