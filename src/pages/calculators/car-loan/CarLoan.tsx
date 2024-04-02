import {useRef, useState, useEffect, ChangeEvent} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId } from '../../manager/manager';


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


  function calculateCarLoan(value: string, idx: number): void{
    // Index 0: Loan Amount, Index 1: Deductions, Index 2: Trade-in, Index 3: Taxes,
    // Index 4: Interest Rate, Index 5: Term

    if(checkIfNumber(value)){
      carLoanFormulaArr.current[idx] = Number(value);
    }
    else{
      carLoanFormulaArr.current[idx] = 0;
    }

    // Principal Loan Amount
    const p: number = carLoanFormulaArr.current[0];
    // Deductions
    const d: number = carLoanFormulaArr.current[1];
    // Trade-in
    const ti: number = carLoanFormulaArr.current[2];
    // Taxes
    const t: number = carLoanFormulaArr.current[3];
    // Interest Rate
    const r: number = carLoanFormulaArr.current[4] / 12 / 100;
    // Term
    const n: number = carLoanFormulaArr.current[5];

    const loanAmount: number = p - d - ti; // Before taxes

    const totalLoanAmount: number = loanAmount * (1 + t); // After taxes

    const montlhyPayments: number =  totalLoanAmount * r / (1 - Math.pow(1 + r, -n));

    setMonthlyPayments(montlhyPayments)
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