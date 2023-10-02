import { ChangeEvent } from "react";

function validateInput(input: string): boolean{
  return Number.isInteger(Number(input));
}

export function editInputs(e: ChangeEvent<HTMLInputElement>, currentValue: string, 
                            expectation: string): string{
  let inputValue: string = currentValue;
  const input: CompositionEvent = e.nativeEvent as CompositionEvent;

  if(input.data === null){
    inputValue = inputValue.slice(0, -1);
  }
  else if((input.data === " " || input.data === ",") && expectation === "number"){
    inputValue = inputValue + ".";
  }
  else{
    inputValue = inputValue + input.data; 
  }

  // if(!validateInput(inputValue) && expectation === "number"){
  //   inputValue = inputValue.slice(0, -1);
  //   e.currentTarget.style.border = "1px solid red";
  // }
  // else{
  //   e.currentTarget.style.cssText = "";
  // }

  return inputValue;
}

export function uniqueId(): string{
  const prefix: string = "uniqueId-";
  const timeStamp: string = Date.now().toString(36);
  let counter: number = 0;
  return `${prefix}${timeStamp}-${counter++}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
}