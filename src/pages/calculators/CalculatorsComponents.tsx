import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
  charFinderAndReconstruct } from '../manager/manager';

type calculatorOptionObj = {
  amountStr: string,
  amountInterestStr: string
}

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

function CalculatorPaymentOptions(props: {paymentOptionLabels: string[], 
                                  paymentOptionObjs: calculatorOptionObj[],
                                  inputValuesStore: number[]}): JSX.Element
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

function CalculatorComponent(props: {calculatorInputLabels: string[]}): JSX.Element{
  const [inputValuesStore, setInputValuesStore] = useState<number[]>(new Array(props.calculatorInputLabels.length).fill(-1));
}