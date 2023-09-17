import {Link} from 'react-router-dom';
import { useState } from 'react';

function KebabMenu(){
  return(
    <aside>
      <nav>
        
      </nav>
    </aside>
  )
}

export default function Header(){
  const [kebabMenu, setKebabMenu] = useState<React.JSX.Element | null>(null);

  function sideMenuHandler(): void{
    if(kebabMenu){
      setKebabMenu(prev => prev = null);
    }
    else{
      setKebabMenu(prev => prev = <KebabMenu />);
    }
  }

  return(
    <header>
      <nav>
        <ul>
          <li>
            <button id="kebab-menu" onClick={sideMenuHandler}>
              <span>&#8901;</span>
              <span>&#8901;</span>
              <span>&#8901;</span>
            </button>
            <Link to={""}>Home</Link>
          </li>
          <li>
            <Link to={"/manager"}>Profile</Link>
          </li>
        </ul>
      </nav>
      {kebabMenu}
    </header>
  )
}