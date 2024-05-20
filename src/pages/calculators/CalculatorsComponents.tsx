import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
  charFinderAndReconstruct } from '../manager/manager';

export type calculatorOptionObj = {
  amountStr: string,
  amountInterestStr: string
}

type calculatorFunction = (inputValues: number[]) => calculatorOptionObj[];

// The order of "calculatorLabels" string array matters! 
// Calculations are made based on that order.
function CalculatorInput(props: {calculatorInputLabel: string, idx: number, storeInputValue: Function}): JSX.Element{
  // ******* References ******* //
  const calculatorInputRef = useRef<HTMLInputElement>(null);

  // ******* Memos ******* //

  // ******* States ******* //
  const [calculatorInputValue, setCalculatorInputValue] = useState<string>("");

  // ******* Input Handlers ******* //
  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, calculatorInputValue, "number");

    console.log("Current mortgage state:",calculatorInputValue);

    setCalculatorInputValue(userInput);

    props.storeInputValue(userInput, props.idx);
  }

  // ******* Use Effects ******* //
  useEffect(()=>{
    if(calculatorInputRef.current){
      calculatorInputRef.current.selectionStart = caretPosition;
      calculatorInputRef.current.selectionEnd = caretPosition;
    }

  }, [calculatorInputValue]);

  return(
    <div className="mortgage-input-wrapper">
      <label htmlFor={`calculator-input${props.idx}`} className="input-label">
          {props.calculatorInputLabel}
      </label>
      <input type="text" ref={calculatorInputRef} value={calculatorInputValue} placeholder='0'
          onChange={updateInputValue} onSelect={getCaretPosition} className="mortgage-input"
            id={`calculator-input${props.idx}`}/>
    </div>
  )
}

export function CalculatorInputs(props: {calculatorInputLabels: string[], calculatorFunction: Function}): JSX.Element{
  return(
    <>
      {props.calculatorInputLabels.map((label, idx) =>
        <CalculatorInput calculatorInputLabel={label} idx={idx} storeInputValue={props.calculatorFunction} 
          key={`calculatorInput-key${idx}`} />
      )}
    </>
  )
}

function CalculatorOptionsPhantom(props: {paymentOptionLabels: string[]}): JSX.Element{
  return(
    <div id="mortgage-calculations-wrapper">
      <div id="mortgage-labels">
        {props.paymentOptionLabels.map((labels, index) =>
          index !== 0 ? 
          <h3 key={`label-key${index}`}>{labels}</h3> : null
        )}
      </div>
      <div id="mortgage-payments-options">
        {props.paymentOptionLabels.map((options, index) =>
          index !== 0 ? 
          <p key={`options-key${index}`} className="phantom-element"></p> : null
        )}
      </div>
      <div id="mortgage-total-interest">
        <h3 id="mortgage-total-interest-title">Total Interest</h3>
        {props.paymentOptionLabels.map((options, index) =>
          index !== 0 ? 
          <p key={`interest-key${index}`} className="phantom-element"></p> : null
        )}
      </div>
    </div>
  )
}

function CalculatorPaymentOptions(props: {paymentOptionLabels: string[], 
                                  paymentOptionObjs: calculatorOptionObj[]}): JSX.Element
{
  return(
    <div id="mortgage-calculations-wrapper">
      <div id="mortgage-labels">
        {props.paymentOptionLabels.map((labels, index) =>
          index !== 0 ? 
          <h3 key={`label-key${index}`}>{labels}</h3> : null
        )}
      </div>
      <div id="mortgage-payments-options">
      <div></div>
        {props.paymentOptionObjs.map((options, index) =>
          index !== 0 ? 
          <p key={`options-key${index}`}>{options.amountStr}</p> : null
        )}
      </div>
      <div id="mortgage-total-interest">
        <h3 id="mortgage-total-interest-title">Total Interest</h3>
        {props.paymentOptionObjs.map((options, index) =>
          index !== 0 ? 
          <p key={`interest-key${index}`}>{options.amountInterestStr}</p> : null
        )}
      </div>
    </div>
  ) 
}

function CalculatorComponent(props: {calculatorInputLabels: string[], calculationAlgo: calculatorFunction,
                                      componentTitle: string, paymentOptionLabels: string[]}): JSX.Element{
  const inputValuesStore = useRef<number[]>(new Array(props.calculatorInputLabels.length).fill(-1));
  const [calculatedValues, setCalculatedValues] = useState<calculatorOptionObj[] | null>(null);

  function checkIfAllcalculatedPaymentOptionsValid(calculatedPaymentOptions: calculatorOptionObj[]): void{
    if(calculatedPaymentOptions.length === 0){
      setCalculatedValues(null);
      return;
    }

    for(let i: number = 0; i < calculatedPaymentOptions.length; i++){
      if(!checkIfNumber(calculatedPaymentOptions[i].amountStr) && !checkIfNumber(calculatedPaymentOptions[i].amountInterestStr)){
        setCalculatedValues(null);
        return;
      }
    }

    setCalculatedValues(calculatedPaymentOptions);
  }

  function checkIfAllInputsValid(): calculatorOptionObj[]{
    for(let i: number = 0; i < inputValuesStore.current.length; i++){
      if(inputValuesStore.current[i] === -1) {
        return [];
      }
    }

    return props.calculationAlgo(inputValuesStore.current);
  }

  function storeInputValue(inputValue: string, idx: number): void{
    if(!checkIfNumber(inputValue)){
      return;
    } 

    inputValuesStore.current[idx] = Number(inputValue);
    checkIfAllcalculatedPaymentOptionsValid(checkIfAllInputsValid());
  }

  return(
    <div id="mortgage-wrapper">
      <h1>{props.componentTitle}</h1>
      <form id="mortgage-form">
        <CalculatorInputs calculatorInputLabels={props.calculatorInputLabels} calculatorFunction={storeInputValue} />
      </form>
      <div>
        <label>{props.paymentOptionLabels[0]}</label>
        <p>{calculatedValues ? calculatedValues[0].amountStr : 0}</p>
      </div>
      {calculatedValues ? 
      <CalculatorPaymentOptions paymentOptionLabels={props.paymentOptionLabels} 
            paymentOptionObjs={calculatedValues} /> : 
      <CalculatorOptionsPhantom paymentOptionLabels={props.paymentOptionLabels} />}
    </div>
  )
}

export default CalculatorComponent;