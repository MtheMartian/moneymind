import {useRef} from 'react';
import { checkIfNumber, charFinderAndReconstruct} from '../../manager/manager';
import CalculatorComponent, {calculatorOptionObj} from '../CalculatorsComponents';

function CarLoanCalculator(): JSX.Element{
  const carLoanPaymentFrequencies = useRef<string[]>(["Total", "Monthly", "Bi-weekly", "Weekly"]);
  const carLoanInputLables = useRef<string[]>(["Loan Amount", "Deductions", "Down Payment", "Trade-in",
                                                "Taxes", "Interest Rate", "Term (months)"
  ]);

  function calculateCarLoanHelper(inputValues: number[], idx: number): calculatorOptionObj | null{
    // 0 -> Total, 1 -> Monthly, 2 -> Bi-weekly, 3 -> Weekly
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

    // Index 0: Loan Amount, Index 1: Deductions, Index 2: Down Payment, Index 3: Trade-in, Index 3: Taxes,
    // Index 4: Interest Rate, Index 5: Term

    // Principal Loan Amount
    const p: number = inputValues[0];
    // Deductions
    const d: number = inputValues[1];
    // Down Payment
    const downPayment: number = inputValues[2]
    // Trade-in
    const ti: number = inputValues[3];
    // Taxes
    const t: number = inputValues[4] / 100;
    // Interest Rate
    const r: number = (inputValues[5] / 100) / xType;
    // Term (months to year)
    const n: number = (inputValues[6] / 12) * xType;

    const loanAmount: number = p - downPayment - d - ti; // Before taxes

    const totalLoanAmount: number = loanAmount * (1 + t); // After taxes

    const currPayments: number =  totalLoanAmount * r / (1 - Math.pow(1 + r, -n));

    const totalInterest: number = (currPayments * n) - totalLoanAmount;

    const totalPerPaymentFreq: number = currPayments * n;

    if(!checkIfNumber(String(currPayments))){
      return null;
    }

    return {amountStr: charFinderAndReconstruct(String(currPayments), '.', 2), 
            amountInterestStr: charFinderAndReconstruct(String(totalInterest), '.', 2),
            totalAmountPaymentFreq: charFinderAndReconstruct(String(totalPerPaymentFreq), '.', 2)};  
  }

  function calculateCarLoan(inputValues: number[]): calculatorOptionObj[] | null{
    const calculatedPaymentFrequencies: calculatorOptionObj[] = [];

    if(inputValues[1] >= inputValues[0] || inputValues[2] >= inputValues[0] ||
        inputValues[3] >= inputValues[0])
    {
      return null;
    }

    inputValues.forEach((value, idx) =>{
      const tempObj: calculatorOptionObj | null = calculateCarLoanHelper(inputValues, idx);

      if(tempObj){
        calculatedPaymentFrequencies.push(tempObj);
      }
    });

    return calculatedPaymentFrequencies;
  }
   
  return(
    <CalculatorComponent calculatorInputLabels={carLoanInputLables.current} calculationAlgo={calculateCarLoan}
      componentTitle='Car Note' paymentOptionLabels={carLoanPaymentFrequencies.current} />
  )
}

export default CarLoanCalculator;