import {useRef, useState, useEffect, ChangeEvent, useCallback, useMemo} from 'react';
import { checkIfNumber, editInputs, caretPosition, getCaretPosition, uniqueId,
          charFinderAndReconstruct } from '../../manager/manager';
import "../../manager/manager.css";
import "./mortgage.css";
import "../calculators.css";
import CalculatorComponent, {calculatorOptionObj} from '../CalculatorsComponents';

function MortgageCalculator(): JSX.Element{
  // ******* References ******* //
  const mortgageFormulaArr = useRef<number[]>([]);
  const mortgageLabels = useRef<string[]>(["Total", "Monthly", "Bi-Weekly", "Weekly"]);
  const mortgageInputLabels = useRef<string[]>(["Loan Amount", "Down Payment", "Interest Rate", "Term"]);

  // ******* Memos ******* //

  // ******* States ******* //
  // Index -> 0: Total left, 1: Monthly Payments, 2: Total Interest (Monthly),
  // 3: Bi-Weekly Payments, 4: Total Interest (Bi-Weekly), 5: Weekly Payments, 6: Total Interest (Weekly)

  // ******* Functions *******// 
  // Create and return MortgageOptionsType objects.
  const calculateMortgageHelper = useCallback((inputValues: number[], idx: number): calculatorOptionObj | null =>{
    // Principal Loan Amount
    const p: number = inputValues[0];
    // Down Payment
    const downPayment: number = inputValues[1];
    // Annual Interest Rate
    const r: number = (inputValues[2] / 100) / 12;
    // Term in years
    const n: number = inputValues[3];

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
    const trueLoanAmount: number = p - downPayment;
    let currPayments: number =  trueLoanAmount * (currRate * Math.pow(1 + currRate, currTerm)) / (Math.pow(1 + currRate, currTerm) - 1);
    const totalcurrInterest: number = (currPayments * currTerm) - trueLoanAmount;

    const totalPerPaymentFreq: number = currPayments * (n * xType);

    if(idx === 0){
      currPayments = currPayments * n;
    }
    
    const currPaymentsStr: string = String(currPayments);
    const totalCurrInterestStr: string = String(totalcurrInterest);

    if(checkIfNumber(currPaymentsStr) && checkIfNumber(totalCurrInterestStr)){
      console.log("I am indeed a number!");
      console.log("I am not a number!", String(currPayments), String(totalcurrInterest));
      return {amountStr: charFinderAndReconstruct(String(currPayments), '.', 2),
      amountInterestStr: charFinderAndReconstruct(String(totalcurrInterest), '.', 2),
      totalAmountPaymentFreq: charFinderAndReconstruct(String(totalPerPaymentFreq), '.', 2)};
    }
  
    console.log("I am not a number!", String(currPayments), String(totalcurrInterest));

    return null;
  }, []);

  // Display results of inputs for the mortgage (state change).
  const calculateMortgage = useCallback((inputValues: number[]): calculatorOptionObj[] | null =>{
    const calculatedPaymentOptionsObj: calculatorOptionObj[] = [];

    if(inputValues[1] >= inputValues[0])
    {
      return null;
    }

    mortgageLabels.current.forEach((label, idx) =>{
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