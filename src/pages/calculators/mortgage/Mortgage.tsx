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

    console.log("Current mortgage state:",mortgageInputState);

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

type mortgageOptionsType = {
  paymentLabel: string,
  amountStr: string,
  amountInterestStr: string
}

function MortgageOptions(props: {mortgageOptionsArr: mortgageOptionsType[]}): JSX.Element{
  return(
    <div>
      {props.mortgageOptionsArr.map(options =>
        <div>
          <div>
            <label>{options.paymentLabel}</label>
            <p>{options.amountStr}</p>
          </div>
          <div>
            <p>{options.amountInterestStr}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MortgageCalculator(): JSX.Element{
  const mortgageFormulaArr = useRef<number[]>([]);

  // Index -> 0: Total left, 1: Monthly Payments, 2: Total Interest (Monthly),
  // 3: Bi-Weekly Payments, 4: Total Interest (Bi-Weekly), 5: Weekly Payments, 6: Total Interest (Weekly)
  const [mortgagePaymentOptions, setMortgagePaymentOptions] = useState<mortgageOptionsType[]>([]);

  const calculateMortgageHelper = useCallback((idx: number): mortgageOptionsType =>{
    // Principal Loan Amount
    const p: number = mortgageFormulaArr.current[0];
    // Annual Interest Rate
    const r: number = (mortgageFormulaArr.current[1] / 100) / 12;
    // Term in years
    const n: number = mortgageFormulaArr.current[2];

    let xType: number = 0;
    let xString: string = "";

    switch(idx){
      case 0:
        xType = 1;
        xString = "Total";
        break;

      case 1:
        xType = 12;
        xString = "Monthly";
        break;

      case 2:
        xType = 26;
        xString = "Bi-Weekly";
        break;

      case 3:
        xType = 52;
        xString = "Weekly";
        break;
    }

    const currRate: number = r / xType;
    const currTerm: number = n * xType;
    const currPayments: number =  p * (currRate * Math.pow(1 + currRate, currTerm)) / (Math.pow(1 + currRate, currTerm) - 1);
    const totalcurrInterest: number = (currPayments * currTerm) - p;

    return {paymentLabel: `${xString}:`, amountStr: String(currPayments),
    amountInterestStr: String(totalcurrInterest)};
  }, []);

  const calculateMortgage = useCallback((value: string, idx: number): void =>{
    const mortgagePaymentOptionsArr: mortgageOptionsType[] = mortgagePaymentOptions;

    // Index 0: Loan Amount, Index 1: Interest Rate, Index 2: Term
    if(checkIfNumber(value)){
      mortgageFormulaArr.current[idx] = Number(value);
    }
    else{
      mortgageFormulaArr.current[idx] = 0;
    }

    for(let i: number = 0; i < 4; i++){
      const tempObj: mortgageOptionsType = calculateMortgageHelper(i);
      if(checkIfNumber(String(tempObj.amountStr) && String(tempObj.amountInterestStr))){
        console.log("It is a number.", String(tempObj.amountStr));
        mortgagePaymentOptionsArr.push(tempObj); 
      }
      else{
        console.log("Wasn't a number.", String(tempObj.amountStr));
        return;
      }
    }

    setMortgagePaymentOptions(mortgagePaymentOptionsArr);
    
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
      setMortgagePaymentOptions([]);
    }

  }, []);
   
  return(
    <div id="mortgage-wrapper">
      <h1>Mortgage Payments</h1>
      <form id="mortgage-form">
        {mortgageInputsArr}
        <div>
          <label>{mortgagePaymentOptions[0].paymentLabel}</label>
          <p>{mortgagePaymentOptions[0].amountStr}</p>
        </div>
      </form>
      <MortgageOptions mortgageOptionsArr={mortgagePaymentOptions} />
    </div>
  )
}

export default MortgageCalculator;