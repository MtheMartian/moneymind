import {useRef, useState, useEffect, ChangeEvent} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId } from '../../manager/manager';
import "../../manager/manager.css";
import "./mortgage.css";

function MortgageInput(props: {calculateMortgage: Function, idx: number}): JSX.Element{
  const [mortgageInputState, setMortgageInputState] = useState<string>("0");

  const mortgageInputRef = useRef<HTMLInputElement>(null);

  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, mortgageInputState, "number");

    setMortgageInputState(userInput);

    props.calculateMortgage(userInput, props.idx);
  }

  useEffect(()=>{
    if(mortgageInputRef.current){
      mortgageInputRef.current.selectionStart = caretPosition;
      mortgageInputRef.current.selectionEnd = caretPosition;
    }

  }, [mortgageInputState]);

  return(
    <input type="text" ref={mortgageInputRef} value={mortgageInputState} 
          onChange={updateInputValue} onSelect={getCaretPosition} className="mortgage-input"/>
  )
}

function MortgageCalculator(): JSX.Element{
  const mortgageFormulaArr = useRef<number[]>([]);
  const [monthlyMortgage, setMonthlyMortgage] = useState<string>("0");

  function calculateMortgage(value: string, idx: number): void{
    // Index 0: Loan Amount, Index 1: Interest Rate, Index 2: Term

    if(checkIfNumber(value)){
      mortgageFormulaArr.current[idx] = Number(value);
    }
    else{
      mortgageFormulaArr.current[idx] = 0;
    }

    // Principal Loan Amount
    const p: number = mortgageFormulaArr.current[0];
    // Interest Rate
    const r: number = mortgageFormulaArr.current[1];
    // Number of payments
    const n: number = mortgageFormulaArr.current[2];

    const montlhyPayments: number = p * r*Math.pow((1 + r), n) / Math.pow((1 + r), n) - 1;

    setMonthlyMortgage(String(montlhyPayments));
  }

  function returnMortgageInputsJSX(): JSX.Element[]{
    const jsxElementArr: JSX.Element[] = [];

    for(let i: number = 0; i < 3; i++){
      jsxElementArr.push(
      <MortgageInput calculateMortgage={calculateMortgage} idx={i} 
        key={uniqueId()}/>
      );
    }

    return jsxElementArr;
  }

  
  useEffect(()=>{
    // Implement local storage, in case the user desires to save his inputs.

    return()=>{
      setMonthlyMortgage("0");
    }

  }, []);
   
  return(
    <div id="mortgage-wrapper">
      <form id="mortgage-form">
        {returnMortgageInputsJSX()}
        <p>{monthlyMortgage}</p>
      </form>
    </div>
  )
}

export default MortgageCalculator;