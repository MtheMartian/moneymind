import {Link} from 'react-router-dom';

function LeftSideMenu(){
  
}

export default function Header(){
  return(
    <header>
      <nav>
        <ul>
          <li>
            <Link to={""}>Home</Link>
          </li>
          <li>
            <Link to={"/manager"}>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}