import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
          charFinderAndReconstruct } from '../../manager/manager';
import "../../manager/manager.css";
import "./mortgage.css";
import "../calculators.css";

type mortgageOptionsType = {
  amountStr: string,
  amountInterestStr: string
}

function MortgageInput(props: {calculateMortgage: Function, idx: number}): JSX.Element{
  // ******* References ******* //
  const mortgageInputRef = useRef<HTMLInputElement>(null);

  // ******* Memos ******* //
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

  // ******* States ******* //
  const [mortgageInputState, setMortgageInputState] = useState<string>("");

  // ******* Input Handlers ******* //
  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, mortgageInputState, "number");

    console.log("Current mortgage state:",mortgageInputState);

    setMortgageInputState(userInput);

    props.calculateMortgage(userInput, props.idx);
  }

  // ******* Use Effects ******* //
  useEffect(()=>{
    if(mortgageInputRef.current){
      mortgageInputRef.current.selectionStart = caretPosition;
      mortgageInputRef.current.selectionEnd = caretPosition;
    }

  }, [mortgageInputState]);

  return(
    <div className="mortgage-input-wrapper">
      <label htmlFor={`mortgate-input${props.idx}`} className="input-label">
          {mortgageInputLabel}
      </label>
      <input type="text" ref={mortgageInputRef} value={mortgageInputState} placeholder='0'
          onChange={updateInputValue} onSelect={getCaretPosition} className="mortgage-input"
            id={`mortgate-input${props.idx}`}/>
    </div>
  )
}

function MortgageOptionsPhantom(props: {mortgageLabels: string[]}): JSX.Element{
  return(
    <div id="mortgage-calculations-wrapper">
      <div id="mortgage-labels">
        {props.mortgageLabels.map((labels, index) =>
          index !== 0 ? 
          <h3 key={`label-key${index}`}>{labels}</h3> : null
        )}
      </div>
      <div id="mortgage-payments-options">
        {props.mortgageLabels.map((options, index) =>
          index !== 0 ? 
          <p key={`options-key${index}`} className="phantom-element"></p> : null
        )}
      </div>
      <div id="mortgage-total-interest">
        <h3 id="mortgage-total-interest-title">Total Interest</h3>
        {props.mortgageLabels.map((options, index) =>
          index !== 0 ? 
          <p key={`interest-key${index}`} className="phantom-element"></p> : null
        )}
      </div>
    </div>
  )
}

function MortgageOptions(props: {mortgageOptionsArr: mortgageOptionsType[], mortgageLabels: string[]}): JSX.Element{
  return(
    <div id="mortgage-calculations-wrapper">
      <div id="mortgage-labels">
        {props.mortgageLabels.map((labels, index) =>
          index !== 0 ? 
          <h3 key={`label-key${index}`}>{labels}</h3> : null
        )}
      </div>
      <div id="mortgage-payments-options">
      <div></div>
        {props.mortgageOptionsArr.map((options, index) =>
          index !== 0 ? 
          <p key={`options-key${index}`}>{options.amountStr}</p> : null
        )}
      </div>
      <div id="mortgage-total-interest">
        <h3 id="mortgage-total-interest-title">Total Interest</h3>
        {props.mortgageOptionsArr.map((options, index) =>
          index !== 0 ? 
          <p key={`interest-key${index}`}>{options.amountInterestStr}</p> : null
        )}
      </div>
    </div>
  )
}

function MortgageCalculator(): JSX.Element{
  // ******* References ******* //
  const mortgageFormulaArr = useRef<number[]>([]);
  const mortgageLabels = useRef<string[]>(["Total", "Monthly", "Bi-Weekly", "Weekly"]);

  // ******* Memos ******* //
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

  // ******* States ******* //
  // Index -> 0: Total left, 1: Monthly Payments, 2: Total Interest (Monthly),
  // 3: Bi-Weekly Payments, 4: Total Interest (Bi-Weekly), 5: Weekly Payments, 6: Total Interest (Weekly)
  const [mortgagePaymentOptions, setMortgagePaymentOptions] = useState<mortgageOptionsType[]>([]);

  // ******* Functions *******// 
  // Create and return MortgageOptionsType objects.
  const calculateMortgageHelper = useCallback((idx: number): mortgageOptionsType =>{
    // Principal Loan Amount
    const p: number = mortgageFormulaArr.current[0];
    // Annual Interest Rate
    const r: number = (mortgageFormulaArr.current[1] / 100) / 12;
    // Term in years
    const n: number = mortgageFormulaArr.current[2];

    // xTypes: 1 -> Yearly, 12 -> Monthly, 26 -> Bi-weekly, 52 -> Weekly
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

    const currRate: number = r / xType;
    const currTerm: number = n * xType;
    let currPayments: number =  p * (currRate * Math.pow(1 + currRate, currTerm)) / (Math.pow(1 + currRate, currTerm) - 1);
    const totalcurrInterest: number = (currPayments * currTerm) - p;

    if(idx === 0){
      currPayments = currPayments * n;
    }

    return {amountStr: charFinderAndReconstruct(String(currPayments), '.', 2),
    amountInterestStr: charFinderAndReconstruct(String(totalcurrInterest), '.', 2)};
  }, []);

  // Display results of inputs for the mortgage (state change).
  const calculateMortgage = useCallback((value: string, idx: number): void =>{
    const mortgagePaymentOptionsArr: mortgageOptionsType[] = [];

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
  
  // ******* Use Effects ******* //
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
      </form>
      {mortgagePaymentOptions.length > 0 ? 
      <div>
        <label>{mortgageLabels.current[0]}</label>
        <p>{mortgagePaymentOptions[0].amountStr}</p>
      </div> : 
      <div>
        <label>{mortgageLabels.current[0]}</label>
        <p></p>
      </div>}
      {mortgagePaymentOptions.length > 0 ? 
      <MortgageOptions mortgageOptionsArr={mortgagePaymentOptions} 
        mortgageLabels={mortgageLabels.current} /> : 
      <MortgageOptionsPhantom mortgageLabels={mortgageLabels.current} />}
    </div>
  )
}

export default MortgageCalculator;