import { highlightElementError } from "../manager";
import { ChangeEvent } from "react";

const inputVerifyArr: boolean[] = [true, true ,true];
export const todayDate: Date = new Date(Date.now());

export const monthsInt: Map<string, number> = new Map([["january", 0], ["february", 1], ["march", 2], 
                                                    ["april", 3], ["may", 4], ["june", 5],
                                                    ["july", 6], ["august", 7], ["september", 8], 
                                                    ["october", 9], ["november", 10], ["december", 11]]);

export const dateEntries: number[] = [todayDate.getUTCFullYear(), todayDate.getMonth(), todayDate.getDate()];

export function checkIfFullNumber(elementEvent: ChangeEvent<HTMLInputElement>): void{

  const element: HTMLInputElement = elementEvent.currentTarget;
  const input: string = element.value;

  if(Number.isInteger(Number(input)) && Number(input) > 0){
    highlightElementError(element, true); 
    return;
  }

  highlightElementError(element, false);
}