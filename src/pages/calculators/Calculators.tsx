import "./calculators.css";
import { Link } from "react-router-dom";

function Calculators(): JSX.Element{
  const allCalculators: {title: string, image: string, link: string}[] = [
    {title: "Mortgage", image: "", link:"/manager/mortgage"},
    {title: "Car Loan", image: "", link:"/manager/car-loan"},
    {title: "Mortgage", image: "", link:"/manager/mortgage"},
    {title: "Car Loan", image: "", link:"/manager/mortgage"},
    {title: "Mortgage", image: "", link:"/manager/mortgage"},
    {title: "Car Loan", image: "", link:"/manager/mortgage"}
  ];

  return(
    <div id="calculators-wrapper">
      {allCalculators.map(calculator =>
        <Link to={calculator.link} className="calculators">
          <img src={calculator.image} alt={calculator.title}/>
          <p>{calculator.title}</p>
        </Link>
      )}
    </div>
  )
}

export default Calculators;
