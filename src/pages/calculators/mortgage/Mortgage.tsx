import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId } from '../../manager/manager';
import "../../manager/manager.css";
import "./mortgage.css";

function MortgageInput(props: {calculateMortgage: Function, idx: number}): JSX.Element{
  const [mortgageInputState, setMortgageInputState] = useState<string>("");

  const mortgageInputRef = useRef<HTMLInputElement>(null);

  const mortgageInputLabel = useMemo<string>((): string =>{
    // Index 0: Loan Amount, Index 1: Interest Rate, Index 2: Term
    switch(props.idx){
      case 0:
        return "Loan Amount";

      case 1: 
        return "Interest Rate";

      case 2: 
        return "Term";

      default:
        return "";
    }
  }, []);

  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, mortgageInputState, "number");

    console.log(mortgageInputState);

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
    <div className="mortgage-input-wrapper">
      <label htmlFor={`mortgate-input${props.idx}`}>
          {mortgageInputLabel}
      </label>
      <input type="text" ref={mortgageInputRef} value={mortgageInputState} placeholder='0'
          onChange={updateInputValue} onSelect={getCaretPosition} className="mortgage-input"
            id={`mortgate-input${props.idx}`}/>
    </div>
  )
}

function MortgageCalculator(): JSX.Element{
  const mortgageFormulaArr = useRef<number[]>([]);
  const [monthlyMortgage, setMonthlyMortgage] = useState<string>("0");

  const calculateMortgage = useCallback((value: string, idx: number): void =>{
    // Index 0: Loan Amount, Index 1: Interest Rate, Index 2: Term

    if(checkIfNumber(value)){
      console.log(value);
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

    const firstPart: number = p * r*Math.pow((1 + r), n);
    const secondPart: number = Math.pow((1 + r), n) - 1;

    const montlhyPayments: number =  firstPart /  secondPart;

    if(checkIfNumber(String(montlhyPayments))){
      console.log("It is a number.", String(montlhyPayments));
      setMonthlyMortgage(String(montlhyPayments));
    }
    else{
      console.log("Wasn't a number.", String(montlhyPayments));
      return;
    }
  }, []);

  const mortgageInputsArr = useMemo<JSX.Element[]>(()=>{
    const jsxElementArr: JSX.Element[] = [];

    for(let i: number = 0; i < 3; i++){
      jsxElementArr.push(
      <MortgageInput calculateMortgage={calculateMortgage} idx={i} 
        key={uniqueId()}/>
      );
    }

    return jsxElementArr;
  }, []);
  
  useEffect(()=>{
    // Implement local storage, in case the user desires to save his inputs.

    return()=>{
      setMonthlyMortgage("0");
    }

  }, []);
   
  return(
    <div id="mortgage-wrapper">
      <form id="mortgage-form">
        {mortgageInputsArr}
        <p>{monthlyMortgage}</p>
      </form>
    </div>
  )
}

export default MortgageCalculator;