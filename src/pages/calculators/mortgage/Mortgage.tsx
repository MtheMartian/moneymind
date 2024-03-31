import {useRef, useState, useEffect, ChangeEvent} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition } from '../../manager/manager';


function MortgageInput(props: {calculateMortgage: Function, idx: number}): JSX.Element{
  const [mortgageInputState, setMortgageInputState] = useState<number>(0);

  const mortgageInputRef = useRef<HTMLInputElement>(null);

  function updateInputValue(e: ChangeEvent<HTMLInputElement>): void{
    const userInput: string = editInputs(e, e.currentTarget.value, "number");

    setMortgageInputState(Number(userInput));

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
          onChange={updateInputValue} onSelect={getCaretPosition}/>
  )
}

function MortgageCalculator(): JSX.Element{
  const mortgageFormulaArr = useRef<number[]>([]);
  const [monthlyMortgage, setMonthlyMortgage] = useState<number>(0);


  function calculateMortgage(value: string, idx: number): void{
    // Index 0: Loan Amount, Index 1: Interest Rate, Index 2: Term

    switch(idx){
      case 0:
        if(checkIfNumber(value)){
          mortgageFormulaArr.current[0] = Number(value);
        }
        else{
          mortgageFormulaArr.current[0] = 0;
        }

        break;

      case 1:
        if(checkIfNumber(value)){
          mortgageFormulaArr.current[1] = Number(value);
        }
        else{
          mortgageFormulaArr.current[1] = 0;
        }
        
        break;

      case 2:
        if(checkIfNumber(value)){
          mortgageFormulaArr.current[2] = Number(value);
        }
        else{
          mortgageFormulaArr.current[2] = 0;
        }
        
        break;
    }

    // Principal Loan Amount
    const p: number = mortgageFormulaArr.current[0];
    // Interest Rate
    const r: number = mortgageFormulaArr.current[1];
    // Number of payments
    const n: number = mortgageFormulaArr.current[2];

    const montlhyPayments: number = p * r*Math.pow((1 + r), n) / Math.pow((1 + r), n) - 1;

    setMonthlyMortgage(montlhyPayments)
  }

  
  useEffect(()=>{
    // Implement local storage, in case the user desires to save his inputs.

    return()=>{
      setMonthlyMortgage(0);
    }

  }, []);
   
  return(
    <div>
      <form>
        <MortgageInput calculateMortgage={calculateMortgage} idx={0} />
        <MortgageInput calculateMortgage={calculateMortgage} idx={1} />
        <MortgageInput calculateMortgage={calculateMortgage} idx={2} />
        <p>{monthlyMortgage}</p>
      </form>
    </div>
  )
}

export default MortgageCalculator;