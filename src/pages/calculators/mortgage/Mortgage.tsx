import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
          charFinderAndReconstruct } from '../../manager/manager';
import "../../manager/manager.css";
import "./mortgage.css";
import "../calculators.css";
import CalculatorComponent, {calculatorOptionObj} from '../CalculatorsComponents';

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
  const mortgageInputLabels = useRef<string[]>(["Loan Amount", "Interest Rate", "Term"]);

  // ******* Memos ******* //

  // ******* States ******* //
  // Index -> 0: Total left, 1: Monthly Payments, 2: Total Interest (Monthly),
  // 3: Bi-Weekly Payments, 4: Total Interest (Bi-Weekly), 5: Weekly Payments, 6: Total Interest (Weekly)

  // ******* Functions *******// 
  // Create and return MortgageOptionsType objects.
  const calculateMortgageHelper = useCallback((inputValues: number[], idx: number): calculatorOptionObj | null =>{
    // Principal Loan Amount
    const p: number = inputValues[0];
    // Annual Interest Rate
    const r: number = (inputValues[1] / 100) / 12;
    // Term in years
    const n: number = inputValues[2];

    // xTypes: 1 -> Yearly, 12 -> Monthly, 26 -> Bi-weekly, 52 -> Weekly
    let xType: number = 0; 
    const currRate: number = r / xType;
    const currTerm: number = n * xType;
    let currPayments: number =  p * (currRate * Math.pow(1 + currRate, currTerm)) / (Math.pow(1 + currRate, currTerm) - 1);
    const totalcurrInterest: number = (currPayments * currTerm) - p;

    switch(idx){
      case 0:
        currPayments = currPayments * n;
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
    
    const currPaymentsStr: string = String(currPayments);
    const totalCurrInterestStr: string = String(totalcurrInterest);

    if(checkIfNumber(currPaymentsStr) && checkIfNumber(totalCurrInterestStr)){
      console.log("I am indeed a number!");
      return {amountStr: charFinderAndReconstruct(String(currPayments), '.', 2),
      amountInterestStr: charFinderAndReconstruct(String(totalcurrInterest), '.', 2)};
    }
  
    console.log("I am not a number!", String(currPayments), String(totalcurrInterest));

    return null;
  }, []);

  // Display results of inputs for the mortgage (state change).
  const calculateMortgage = useCallback((inputValues: number[]): calculatorOptionObj[] =>{
    const calculatedPaymentOptionsObj: calculatorOptionObj[] = [];

    inputValues.forEach((value, idx) =>{
      const tempObj: calculatorOptionObj | null = calculateMortgageHelper(inputValues, idx);
      if(tempObj){
        calculatedPaymentOptionsObj.push(tempObj)
      }
    });

    return calculatedPaymentOptionsObj;  
  }, []);
  
  // ******* Use Effects ******* //
   
  return(
    <CalculatorComponent componentTitle='Mortgage Calculator' calculationAlgo={calculateMortgage}
          calculatorInputLabels={mortgageInputLabels.current} paymentOptionLabels={mortgageLabels.current} />
  )
}

export default MortgageCalculator;