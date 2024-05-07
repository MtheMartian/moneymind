import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
  charFinderAndReconstruct } from '../manager/manager';


// The order of "calculatorLabels" string array matters! 
// Calculations are made based on that order.
function CalculatorInputs(props: {calculatorLabels: string[], idx: number}): JSX.Element{
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

    props.calculateMortgage(userInput, props.idx);
  }

  // ******* Use Effects ******* //
  useEffect(()=>{
    if(calculatorInputRef.current){
      calculatorInputRef.current.selectionStart = caretPosition;
      calculatorInputRef.current.selectionEnd = caretPosition;
    }

  }, [mortgageInputState]);

  return(
    <>
    {props.calculatorLabels.map(label =>
      <div className="mortgage-input-wrapper">
        <label htmlFor={`mortgate-input${props.idx}`} className="input-label">
            {mortgageInputLabel}
        </label>
        <input type="text" ref={mortgageInputRef} value={mortgageInputState} placeholder='0'
            onChange={updateInputValue} onSelect={getCaretPosition} className="mortgage-input"
              id={`mortgate-input${props.idx}`}/>
      </div>
    )}
    </>
  )
}