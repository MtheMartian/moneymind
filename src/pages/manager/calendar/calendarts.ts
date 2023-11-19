import { highlightElementError } from "../manager";
import { ChangeEvent } from "react";

const inputVerifyArr: boolean[] = [true, true ,true];

export function checkIfFullNumber(elementEvent: ChangeEvent<HTMLInputElement>, calendarType?: string): void{

  const element: HTMLInputElement = elementEvent.currentTarget;
  const input: string = element.value;

  if(Number.isInteger(Number(input))){

    const inputToNumber: number = Number(input);

    if(calendarType){
      const todayDate: Date = new Date(Date.now());

      switch(calendarType){
        case "year":
          if(inputToNumber < 2023 || inputToNumber > todayDate.getUTCFullYear()){
            highlightElementError(element, false);
            inputVerifyArr[0] = false;
          }
          else{
            inputVerifyArr[0] = true;
          }

          return;

        case "date":
          if(inputToNumber < 1 || inputToNumber > 31){
            highlightElementError(element, false);
            inputVerifyArr[2] = false;
          }
          else{
            inputVerifyArr[2] = true;
          }

          return;
      }
    }

    highlightElementError(element, true); 
    return;
  }

  highlightElementError(element, false);
  inputVerifyArr.push(false);
}