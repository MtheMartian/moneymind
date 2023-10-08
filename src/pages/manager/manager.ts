import { ChangeEvent } from "react";

function validateInput(input: string): boolean{
  return Number.isInteger(Number(input));
}

function editInputsHelper(caretPosition: number, str: string, toAdd: string): string{
  let newString: string = str.slice(0, caretPosition) + toAdd;

  return newString + str.slice(caretPosition); 
}

export function editInputs(e: ChangeEvent<HTMLInputElement>, currentValue: string, 
                            expectation: string, caretPosition: number): string{
  let inputValue: string = currentValue;
  const input: CompositionEvent = e.nativeEvent as CompositionEvent;

  if(input.data === null){
    inputValue = inputValue.slice(0, caretPosition);
  }
  else if((input.data === " " || input.data === ",") && expectation === "number"){
    inputValue = editInputsHelper(caretPosition, inputValue, ".");
  }
  else{
    inputValue = editInputsHelper(caretPosition, inputValue, input.data);
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

export function checkIfInputEmpty(element: HTMLInputElement): boolean{
  if(element.value.length === 0 || element.value === " "){
    element.style.border = "2px solid red";

    return true;
  }
  
  element.style.cssText = "";
  
  return false;
}

export function checkIfInputEmptyCell(e: ChangeEvent<HTMLInputElement>): boolean{
  const currentElement: HTMLInputElement = e.nativeEvent.currentTarget! as HTMLInputElement;
  console.log(currentElement);

  if(currentElement.value.length === 0 || currentElement.value === " "){
    currentElement.style.border = "2px solid red";

    return true;
  }

  currentElement.style.cssText = "";

  return false;
}