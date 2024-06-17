import {useRef, useState, useEffect, ChangeEvent} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId } from '../../manager/manager';
import CalculatorComponent, {calculatorOptionObj} from '../CalculatorsComponents';


function CarLoanInput(props: {calculateMortgage: Function, idx: number}): JSX.Element{
  const [carLoanInputState, setCarLoanInputState] = useState<number>(0);

  const carLoanInputRef = useRef<HTMLInputElement>(null);

  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, e.currentTarget.value, "number");

    setCarLoanInputState(Number(userInput));

    props.calculateMortgage(userInput, props.idx);
  }

  useEffect(()=>{
    if(carLoanInputRef.current){
      carLoanInputRef.current.selectionStart = caretPosition;
      carLoanInputRef.current.selectionEnd = caretPosition;
    }

  }, [carLoanInputState]);

  return(
    <input type="text" ref={carLoanInputRef} value={carLoanInputState} 
          onChange={updateInputValue} onSelect={getCaretPosition}/>
  )
}

function CarLoanCalculator(): JSX.Element{
  const carLoanFormulaArr = useRef<number[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<number>(0);


  function calculateCarLoan(inputValues: number[], idx: number): calculatorOptionObj{
    // 0 -> Total, 1 -> Monthly, 2 -> Bi-weekly, 3 -> Weekly
    let xType: number = 0; 
    switch(idx){
      case 0:
        xType = 1;
        break;

      case 1:
        xType = 12;
        break;

      case 2: 
        xType = 26;
        break;

      case 3:
        xType = 52;
        break;
    }

    // Index 0: Loan Amount, Index 1: Deductions, Index 2: Trade-in, Index 3: Taxes,
    // Index 4: Interest Rate, Index 5: Term

    // Principal Loan Amount
    const p: number = inputValues[0];
    // Deductions
    const d: number = inputValues[1];
    // Trade-in
    const ti: number = inputValues[2];
    // Taxes
    const t: number = inputValues[3];
    // Interest Rate
    const r: number = (inputValues[4] / 100) / xType;
    // Term (months to year)
    const n: number = (inputValues[5] / 12) * xType;

    const loanAmount: number = p - d - ti; // Before taxes

    const totalLoanAmount: number = loanAmount * (1 + t); // After taxes

    const currPayments: number =  totalLoanAmount * r / (1 - Math.pow(1 + r, -n));

    const totalInterest: number = (currPayments * n) - totalLoanAmount;

    return {amountStr: String(currPayments), amountInterestStr: String(totalInterest)};  
  }

  function returnMCarLoanInputsJSX(): JSX.Element[]{
    const jsxElementArr: JSX.Element[] = [];

    for(let i: number = 0; i < 3; i++){
      jsxElementArr.push(
      <CarLoanInput calculateMortgage={calculateCarLoan} idx={i} 
        key={uniqueId()} />
      );
    }

    return jsxElementArr;
  }

  
  useEffect(()=>{
    // Implement local storage, in case the user desires to save his inputs.

    return()=>{
      setMonthlyPayments(0);
    }

  }, []);
   
  return(
    <div>
      <form>
        {returnMCarLoanInputsJSX()}
        <p>{monthlyPayments}</p>
      </form>
    </div>
  )
}

export default CarLoanCalculator;