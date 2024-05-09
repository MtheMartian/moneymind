import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
  charFinderAndReconstruct } from '../manager/manager';


// The order of "calculatorLabels" string array matters! 
// Calculations are made based on that order.
function CalculatorInput(props: {calculatorLabel: string, idx: number, calculate: Function}): JSX.Element{
  // ******* References ******* //
  const calculatorInputRef = useRef<HTMLInputElement>(null);

  // ******* Memos ******* //

  // ******* States ******* //
  const [mortgageInputState, setMortgageInputState] = useState<string>("");

  // ******* Input Handlers ******* //
  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, mortgageInputState, "number");

    console.log("Current mortgage state:",mortgageInputState);

    setMortgageInputState(userInput);

    props.calculate(userInput, props.idx);
  }

  // ******* Use Effects ******* //
  useEffect(()=>{
    if(calculatorInputRef.current){
      calculatorInputRef.current.selectionStart = caretPosition;
      calculatorInputRef.current.selectionEnd = caretPosition;
    }

  }, [mortgageInputState]);

  return(
    <div className="mortgage-input-wrapper">
      <label htmlFor={`calculator-input${props.idx}`} className="input-label">
          {props.calculatorLabel}
      </label>
      <input type="text" ref={calculatorInputRef} value={mortgageInputState} placeholder='0'
          onChange={updateInputValue} onSelect={getCaretPosition} className="mortgage-input"
            id={`calculator-input${props.idx}`}/>
    </div>
  )
}

function CalculatorInputs(props: {calculatorLabels: string[], calculatorFunction: Function}): JSX.Element{
  return(
    <>
      {props.calculatorLabels.map((label, idx) =>
        <CalculatorInput calculatorLabel={label} idx={idx} calculate={props.calculatorFunction} />
      )}
    </>
  )
}