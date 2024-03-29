import "./calculators.css";
import { Link } from "react-router-dom";

function Calculators(): JSX.Element{
  const allCalculators: {title: string, image: string}[] = [
    {title: "Mortgage", image: ""},
    {title: "Car Loan", image: ""},
    {title: "Mortgage", image: ""},
    {title: "Car Loan", image: ""},
    {title: "Mortgage", image: ""},
    {title: "Car Loan", image: ""}
  ];

  return(
    <div id="calculators-wrapper">
      {allCalculators.map(calculator =>
        <Link to="" className="calculators">
          <img src={calculator.image} alt={calculator.title}/>
          <p>{calculator.title}</p>
        </Link>
      )}
    </div>
  )
}

export default Calculators;
